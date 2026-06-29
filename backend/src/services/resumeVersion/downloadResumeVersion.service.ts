import fs from "fs/promises";
import { getResumeVersion } from "./getResumeVersion.service";
import { ApiError } from "../../utils/ApiError";

export const downloadResumeVersion = async (
  userId: string,
  resumeVersionId: string
) => {
  const resumeVersion = await getResumeVersion(userId, resumeVersionId);

  try {
    await fs.access(resumeVersion.generatedPdfPath);
  } catch {
    throw new ApiError(404, "Generated resume PDF not found");
  }

  return {
    filePath: resumeVersion.generatedPdfPath,
    fileName: `${resumeVersion.versionName.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`,
  };
};
