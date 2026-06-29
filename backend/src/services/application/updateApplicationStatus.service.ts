import { Types } from "mongoose";
import Application from "../../models/application.model";
import {
  UpdateApplicationStatusInput,
  applicationStatuses,
} from "../../types/application.types";
import { ApiError } from "../../utils/ApiError";
import { createStatusTimelineItem } from "./applicationTimeline.service";

export const updateApplicationStatus = async (
  userId: string,
  applicationId: string,
  statusData: UpdateApplicationStatusInput
) => {
  if (!Types.ObjectId.isValid(applicationId)) {
    throw new ApiError(400, "Invalid application id");
  }

  if (!applicationStatuses.includes(statusData.status)) {
    throw new ApiError(400, "Invalid application status");
  }

  const application = await Application.findOne({ _id: applicationId, userId });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  const oldStatus = application.status;

  if (oldStatus === statusData.status) {
    return application;
  }

  application.status = statusData.status;
  application.lastUpdated = new Date();

  if (statusData.status === "APPLIED" && !application.appliedDate) {
    application.appliedDate = new Date();
  }

  application.timeline.push(
    createStatusTimelineItem(
      oldStatus,
      statusData.status,
      statusData.description,
      statusData.attachments
    )
  );

  await application.save();
  await application.populate(["jobId", "companyId", "resumeId"]);

  return application;
};
