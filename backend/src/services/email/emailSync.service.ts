import { Types } from "mongoose";
import Application from "../../models/application.model";
import Campaign from "../../models/campaign.model";
import EmailEvent, { IEmailEvent } from "../../models/emailEvent.model";
import {
  EmailClassifyInput,
  EmailEventInput,
  EmailSyncInput,
  ParsedEmailData,
} from "../../types/email.types";
import { ApiError } from "../../utils/ApiError";
import { extractAttachments } from "./attachmentExtractor.service";
import { classifyEmail } from "./emailClassifier.service";
import { parseEmailMessage } from "./emailParser.service";
import { extractInterviewDetails } from "./interviewExtractor.service";
import { extractOfferDetails } from "./offerExtractor.service";
import { extractRejectionDetails } from "./rejectionExtractor.service";
import { updateApplicationFromEmail } from "./applicationStatusUpdater.service";
import { gmailProvider } from "./gmailProvider.service";
import { createNotification } from "../notification/notification.service";

export const getEmailEvents = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const page = parsePositiveNumber(query.page, 1);
  const limit = Math.min(parsePositiveNumber(query.limit, 20), 100);
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = { userId };

  if (typeof query.classification === "string") {
    filter.classification = query.classification;
  }

  if (typeof query.applicationId === "string") {
    filter.applicationId = query.applicationId;
  }

  if (typeof query.campaignId === "string") {
    filter.campaignId = query.campaignId;
  }

  const [events, total] = await Promise.all([
    EmailEvent.find(filter).sort({ receivedAt: -1 }).skip(skip).limit(limit),
    EmailEvent.countDocuments(filter),
  ]);

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getEmailEvent = async (userId: string, eventId: string) => {
  validateObjectId(eventId, "Invalid email event id");

  const event = await EmailEvent.findOne({ _id: eventId, userId });

  if (!event) {
    throw new ApiError(404, "Email event not found");
  }

  return event;
};

export const syncEmails = async (userId: string, input: EmailSyncInput) => {
  await validateSyncInput(userId, input);

  const providerMessages = await gmailProvider.fetchMessages(userId, input);
  const results: IEmailEvent[] = [];

  for (const message of providerMessages) {
    const parsedEmail = parseEmailMessage(message);
    const event = await createOrUpdateEmailEvent(userId, parsedEmail);
    const processedEvent = await processEmailEvent(userId, event);
    results.push(processedEvent);
  }

  return {
    synced: results.length,
    events: results,
  };
};

export const classifyEmailInput = async (
  userId: string,
  input: EmailClassifyInput
) => {
  if (input.eventId) {
    const event = await getEmailEvent(userId, input.eventId);
    const processedEvent = await processEmailEvent(userId, event);

    return { event: processedEvent };
  }

  if (input.email) {
    const parsedEmail = parseEmailMessage(input.email);
    const event = await createOrUpdateEmailEvent(userId, parsedEmail);
    const processedEvent = await processEmailEvent(userId, event);

    return { event: processedEvent };
  }

  throw new ApiError(400, "eventId or email payload is required");
};

const createOrUpdateEmailEvent = async (
  userId: string,
  email: EmailEventInput
): Promise<IEmailEvent> => {
  const classification = email.classification || classifyEmail(email);

  const event = await EmailEvent.findOneAndUpdate(
    { userId, messageId: email.messageId },
    {
      $set: {
        ...email,
        userId,
        classification,
        attachments: extractAttachments(email),
        receivedAt: new Date(email.receivedAt),
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  if (!event) {
    throw new ApiError(500, "Failed to save email event");
  }

  return event;
};

const processEmailEvent = async (
  userId: string,
  emailEvent: IEmailEvent
): Promise<IEmailEvent> => {
  const parsedData = buildParsedData(emailEvent);

  emailEvent.classification = classifyEmail(emailEvent);
  emailEvent.interviewDetails = parsedData.interviewDetails;
  emailEvent.offerDetails = parsedData.offerDetails;
  emailEvent.parsedData = parsedData;
  emailEvent.isProcessed = true;

  await emailEvent.save();
  await updateApplicationFromEmail(userId, emailEvent);
  await createNotification({
    userId,
    campaignId: emailEvent.campaignId,
    applicationId: emailEvent.applicationId,
    emailEventId: emailEvent._id,
    title: emailEvent.subject,
    message: parsedData.notificationEvent?.message || "Email event processed",
    type: mapEmailClassificationToNotificationType(emailEvent.classification),
    source: "EMAIL",
    channels: ["IN_APP", "PUSH"],
  });

  return emailEvent;
};

const mapEmailClassificationToNotificationType = (
  classification: IEmailEvent["classification"]
) => {
  if (["INTERVIEW", "HR_ROUND", "TECHNICAL_ROUND", "FINAL_ROUND"].includes(classification)) {
    return "INTERVIEW";
  }

  if (classification === "OFFER") {
    return "OFFER";
  }

  if (classification === "REJECTION") {
    return "REJECTION";
  }

  if (
    ["APPLICATION_CONFIRMATION", "UNDER_REVIEW", "ASSESSMENT", "WITHDRAWAL"].includes(
      classification
    )
  ) {
    return "APPLICATION";
  }

  return "INFO";
};

const buildParsedData = (emailEvent: IEmailEvent): ParsedEmailData => {
  const parsedData: ParsedEmailData = {
    metadata: {
      source: "MOCK_GMAIL",
      processedAt: new Date().toISOString(),
    },
  };

  if (
    ["INTERVIEW", "HR_ROUND", "TECHNICAL_ROUND", "FINAL_ROUND"].includes(
      emailEvent.classification
    )
  ) {
    parsedData.interviewDetails = extractInterviewDetails(
      emailEvent.subject,
      emailEvent.body
    );
  }

  if (emailEvent.classification === "OFFER") {
    parsedData.offerDetails = extractOfferDetails(emailEvent.subject, emailEvent.body);
  }

  if (emailEvent.classification === "REJECTION") {
    parsedData.rejectionDetails = extractRejectionDetails(
      emailEvent.subject,
      emailEvent.body
    );
  }

  parsedData.notificationEvent = {
    type: "EMAIL_CLASSIFIED",
    title: emailEvent.subject,
    message: `Email classified as ${emailEvent.classification}`,
  };

  return parsedData;
};

const validateSyncInput = async (
  userId: string,
  input: EmailSyncInput
): Promise<void> => {
  if (input.applicationId) {
    validateObjectId(input.applicationId.toString(), "Invalid application id");
    const application = await Application.findOne({
      _id: input.applicationId,
      userId,
    });

    if (!application) {
      throw new ApiError(404, "Application not found");
    }
  }

  if (input.campaignId) {
    validateObjectId(input.campaignId.toString(), "Invalid campaign id");
    const campaign = await Campaign.findOne({ _id: input.campaignId, userId });

    if (!campaign) {
      throw new ApiError(404, "Campaign not found");
    }
  }
};

const validateObjectId = (value: string, message: string): void => {
  if (!Types.ObjectId.isValid(value)) {
    throw new ApiError(400, message);
  }
};

const parsePositiveNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
