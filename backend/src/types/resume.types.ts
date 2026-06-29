import { Types } from "mongoose";

export interface ResumeSections {
  skills: string[];
  projects: string[];
  education: string[];
  experience: string[];
}

export interface CreateResumeInput extends ResumeSections {
  userId: string | Types.ObjectId;
  originalFileName: string;
  storedFileName: string;
  parsedText: string;
}

export interface ResumeFile {
  originalname: string;
  filename: string;
  path: string;
}
