import fs from "fs/promises";
import path from "path";
import { Types } from "mongoose";
import Resume from "../../models/resume.model";
import { CreateResumeInput, ResumeFile } from "../../types/resume.types";
import { ApiError } from "../../utils/ApiError";
import { analyzeResume } from "./resumeAnalysis.service";
import { parseResume } from "./parseResume.service";

const uploadsDir = path.resolve(process.cwd(), "uploads");

export const uploadResume = async (userId: string, file?: ResumeFile) => {
  if (!file) {
    throw new ApiError(400, "Resume PDF is required");
  }

  const existingResume = await Resume.findOne({ userId });

  if (existingResume) {
    await removeUploadedFile(file.filename);
    throw new ApiError(409, "Master resume already exists");
  }

  try {
    const parsedText = await parseResume(file.path);
    const analysis = analyzeResume(parsedText);

    return await Resume.create(
      buildResumePayload({
        userId,
        originalFileName: file.originalname,
        storedFileName: file.filename,
        parsedText,
        ...analysis,
      })
    );
  } catch (error) {
    await removeUploadedFile(file.filename);
    throw error;
  }
};

export const getMyResume = async (userId: string) => {
  const resume = await Resume.findOne({ userId });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return resume;
};

export const deleteResume = async (userId: string, resumeId: string) => {
  validateResumeId(resumeId);

  const resume = await Resume.findOne({ _id: resumeId, userId });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  await removeUploadedFile(resume.storedFileName);
  await resume.deleteOne();

  return { id: resumeId };
};

export const replaceResume = async (
  userId: string,
  resumeId: string,
  file?: ResumeFile
) => {
  if (!file) {
    throw new ApiError(400, "Resume PDF is required");
  }

  validateResumeId(resumeId);

  const resume = await Resume.findOne({ _id: resumeId, userId });

  if (!resume) {
    await removeUploadedFile(file.filename);
    throw new ApiError(404, "Resume not found");
  }

  const previousFileName = resume.storedFileName;
  try {
    const parsedText = await parseResume(file.path);
    const analysis = analyzeResume(parsedText);

    resume.originalFileName = file.originalname;
    resume.storedFileName = file.filename;
    resume.parsedText = parsedText;
    resume.skills = analysis.skills;
    resume.projects = analysis.projects;
    resume.education = analysis.education;
    resume.experience = analysis.experience;

    await resume.save();
    await removeUploadedFile(previousFileName);

    return resume;
  } catch (error) {
    await removeUploadedFile(file.filename);
    throw error;
  }
};

const buildResumePayload = (input: CreateResumeInput): CreateResumeInput => {
  return input;
};

const removeUploadedFile = async (storedFileName: string): Promise<void> => {
  const filePath = path.join(uploadsDir, storedFileName);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw new ApiError(500, "Unable to delete resume file");
    }
  }
};

const validateResumeId = (resumeId: string): void => {
  if (!Types.ObjectId.isValid(resumeId)) {
    throw new ApiError(400, "Invalid resume id");
  }
};
