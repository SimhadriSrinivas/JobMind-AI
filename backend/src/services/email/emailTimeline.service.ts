import { IApplicationTimelineItem } from "../../models/application.model";
import { IEmailEvent } from "../../models/emailEvent.model";
import { createTimelineItem } from "../application/applicationTimeline.service";

export const createEmailTimelineItem = (
  emailEvent: IEmailEvent
): IApplicationTimelineItem => {
  return createTimelineItem({
    title: `Email: ${emailEvent.classification}`,
    description: emailEvent.subject,
    date: emailEvent.receivedAt,
    attachments: emailEvent.attachments.map((attachment) => attachment.filename),
    metadata: {
      emailEventId: emailEvent._id,
      messageId: emailEvent.messageId,
      threadId: emailEvent.threadId,
      from: emailEvent.from,
      classification: emailEvent.classification,
    },
  });
};
