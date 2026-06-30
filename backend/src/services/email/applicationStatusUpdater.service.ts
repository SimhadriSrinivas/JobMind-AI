import Application from "../../models/application.model";
import { IEmailEvent } from "../../models/emailEvent.model";
import { ApplicationStatus } from "../../types/application.types";
import { EmailClassification } from "../../types/email.types";
import { ApiError } from "../../utils/ApiError";
import { createEmailTimelineItem } from "./emailTimeline.service";

const statusByClassification: Partial<Record<EmailClassification, ApplicationStatus>> = {
  APPLICATION_CONFIRMATION: "APPLIED",
  UNDER_REVIEW: "UNDER_REVIEW",
  ASSESSMENT: "ASSESSMENT",
  INTERVIEW: "INTERVIEW",
  HR_ROUND: "HR_ROUND",
  TECHNICAL_ROUND: "TECHNICAL_ROUND",
  FINAL_ROUND: "FINAL_ROUND",
  OFFER: "OFFER",
  REJECTION: "REJECTED",
  WITHDRAWAL: "WITHDRAWN",
};

export const updateApplicationFromEmail = async (
  userId: string,
  emailEvent: IEmailEvent
) => {
  if (!emailEvent.applicationId) {
    return null;
  }

  const application = await Application.findOne({
    _id: emailEvent.applicationId,
    userId,
  });

  if (!application) {
    throw new ApiError(404, "Application not found for email event");
  }

  const nextStatus = statusByClassification[emailEvent.classification];

  if (nextStatus && application.status !== nextStatus) {
    application.status = nextStatus;
    application.lastUpdated = new Date();
  }

  if (nextStatus === "APPLIED" && !application.appliedDate) {
    application.appliedDate = emailEvent.receivedAt;
  }

  if (
    ["INTERVIEW", "HR_ROUND", "TECHNICAL_ROUND", "FINAL_ROUND"].includes(
      emailEvent.classification
    ) &&
    emailEvent.interviewDetails
  ) {
    application.interviewMode = emailEvent.interviewDetails.meetingPlatform || "ONLINE";
    application.assessmentLink = emailEvent.interviewDetails.meetingLink;
    application.interviewDate = parseDateTime(
      emailEvent.interviewDetails.date,
      emailEvent.interviewDetails.time
    );
  }

  if (emailEvent.classification === "OFFER" && emailEvent.offerDetails) {
    application.offerAmount = emailEvent.offerDetails.salary;
    application.currency = emailEvent.offerDetails.currency || application.currency;
  }

  application.timeline.push(createEmailTimelineItem(emailEvent));

  await application.save();
  return application;
};

const parseDateTime = (
  dateValue?: string,
  timeValue?: string
): Date | undefined => {
  if (!dateValue) {
    return undefined;
  }

  const parsed = new Date(`${dateValue}${timeValue ? ` ${timeValue}` : ""}`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};
