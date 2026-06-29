import mongoose, { Document, Schema, Types } from "mongoose";
import { GeneratedResumeJson } from "../types/resumeVersion.types";

export interface IResumeVersion extends Document {
  userId: Types.ObjectId;
  masterResumeId: Types.ObjectId;
  jobId: Types.ObjectId;
  applicationId: Types.ObjectId;
  versionName: string;
  generatedSkills: string[];
  generatedProjects: string[];
  generatedEducation: string[];
  generatedExperience: string[];
  atsScore: number;
  matchPercentage: number;
  missingSkills: string[];
  addedSkills: string[];
  removedSkills: string[];
  summary: string;
  generatedPdfPath: string;
  generatedJson: GeneratedResumeJson;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const resumeVersionSchema = new Schema<IResumeVersion>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    masterResumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    versionName: {
      type: String,
      required: true,
      trim: true,
    },
    generatedSkills: {
      type: [String],
      default: [],
    },
    generatedProjects: {
      type: [String],
      default: [],
    },
    generatedEducation: {
      type: [String],
      default: [],
    },
    generatedExperience: {
      type: [String],
      default: [],
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    matchPercentage: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    addedSkills: {
      type: [String],
      default: [],
    },
    removedSkills: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    generatedPdfPath: {
      type: String,
      required: true,
    },
    generatedJson: {
      type: Schema.Types.Mixed,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

resumeVersionSchema.index({ userId: 1, applicationId: 1, createdAt: -1 });

export default mongoose.model<IResumeVersion>(
  "ResumeVersion",
  resumeVersionSchema
);
