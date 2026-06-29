import { Types } from "mongoose";
import Application from "../../models/application.model";
import { UpdateApplicationInput } from "../../types/application.types";
import { ApiError } from "../../utils/ApiError";
import { createTimelineItem } from "./applicationTimeline.service";

export const updateApplication = async (
  userId: string,
  applicationId: string,
  applicationData: UpdateApplicationInput
) => {
  if (!Types.ObjectId.isValid(applicationId)) {
    throw new ApiError(400, "Invalid application id");
  }

  if (!applicationData || Object.keys(applicationData).length === 0) {
    throw new ApiError(400, "Application update data is required");
  }

  const { timeline, status, ...updateData } = applicationData;
  const updatePayload: Record<string, unknown> = {
    ...updateData,
    lastUpdated: new Date(),
  };
  const updateOperation: Record<string, unknown> = { $set: updatePayload };

  if (timeline?.length) {
    updateOperation.$push = {
      timeline: {
        $each: timeline.map(createTimelineItem),
      },
    };
  }

  const application = await Application.findOneAndUpdate(
    { _id: applicationId, userId },
    updateOperation,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("jobId")
    .populate("companyId")
    .populate("resumeId");

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  return application;
};
