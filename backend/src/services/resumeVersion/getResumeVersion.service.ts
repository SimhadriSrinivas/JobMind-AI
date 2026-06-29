import { Types } from "mongoose";
import ResumeVersion from "../../models/resumeVersion.model";
import { ApiError } from "../../utils/ApiError";

export const getResumeVersion = async (userId: string, resumeVersionId: string) => {
  if (!Types.ObjectId.isValid(resumeVersionId)) {
    throw new ApiError(400, "Invalid resume version id");
  }

  const resumeVersion = await ResumeVersion.findOne({
    _id: resumeVersionId,
    userId,
  })
    .populate("masterResumeId")
    .populate("jobId")
    .populate("applicationId");

  if (!resumeVersion) {
    throw new ApiError(404, "Resume version not found");
  }

  return resumeVersion;
};
