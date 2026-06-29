import {
  ApplicationStatus,
  ApplicationTimelineInput,
} from "../../types/application.types";

export const createTimelineItem = (input: ApplicationTimelineInput) => {
  return {
    title: input.title,
    description: input.description,
    date: input.date ? new Date(input.date) : new Date(),
    attachments: input.attachments || [],
    metadata: input.metadata || {},
  };
};

export const createStatusTimelineItem = (
  oldStatus: ApplicationStatus,
  newStatus: ApplicationStatus,
  description?: string,
  attachments?: string[]
) => {
  return createTimelineItem({
    title: `${oldStatus} -> ${newStatus}`,
    description:
      description || `Application status changed from ${oldStatus} to ${newStatus}`,
    date: new Date(),
    attachments,
    metadata: {
      oldStatus,
      newStatus,
    },
  });
};
