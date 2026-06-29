import fs from "fs/promises";
import { Types } from "mongoose";
import ResumeVersion from "../../models/resumeVersion.model";
import { ApiError } from "../../utils/ApiError";

export const deleteResumeVersion = async (
  userId: string,
  resumeVersionId: string
) => {
  if (!Types.ObjectId.isValid(resumeVersionId)) {
    throw new ApiError(400, "Invalid resume version id");
  }

  const resumeVersion = await ResumeVersion.findOneAndDelete({
    _id: resumeVersionId,
    userId,
  });

  if (!resumeVersion) {
    throw new ApiError(404, "Resume version not found");
  }

  await removeGeneratedPdf(resumeVersion.generatedPdfPath);

  return { id: resumeVersion._id.toString() };
};

const removeGeneratedPdf = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw new ApiError(500, "Unable to delete generated resume PDF");
    }
  }
};
