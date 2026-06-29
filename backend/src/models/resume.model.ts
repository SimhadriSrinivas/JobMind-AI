import mongoose, { Document, Schema, Types } from "mongoose";

export interface IResume extends Document {
  userId: Types.ObjectId;
  originalFileName: string;
  storedFileName: string;
  parsedText: string;
  skills: string[];
  projects: string[];
  education: string[];
  experience: string[];
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },
    storedFileName: {
      type: String,
      required: true,
    },
    parsedText: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    projects: {
      type: [String],
      default: [],
    },
    education: {
      type: [String],
      default: [],
    },
    experience: {
      type: [String],
      default: [],
    },
  },
  {
    collection: "master_resumes",
    timestamps: true,
  }
);

export default mongoose.model<IResume>("Resume", resumeSchema);
