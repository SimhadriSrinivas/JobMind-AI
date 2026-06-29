import { Types } from "mongoose";
import Application from "../../models/application.model";
import { ApiError } from "../../utils/ApiError";

export const getApplication = async (userId: string, applicationId: string) => {
  if (!Types.ObjectId.isValid(applicationId)) {
    throw new ApiError(400, "Invalid application id");
  }

  const application = await Application.findOne({
    _id: applicationId,
    userId,
  })
    .populate("jobId")
    .populate("companyId")
    .populate("resumeId");

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  return application;
};
