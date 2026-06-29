import mongoose, { Document, Schema } from "mongoose";

export interface ICompany extends Document {
  companyName: string;
  website?: string;
  careersUrl?: string;
  linkedIn?: string;
  glassdoor?: string;
  industry?: string;
  size?: string;
  headquarters?: string;
  logo?: string;
  isHiring: boolean;
  averageResponseDays?: number;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    website: {
      type: String,
      trim: true,
    },
    careersUrl: {
      type: String,
      trim: true,
    },
    linkedIn: {
      type: String,
      trim: true,
    },
    glassdoor: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    headquarters: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    isHiring: {
      type: Boolean,
      default: true,
    },
    averageResponseDays: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICompany>("Company", companySchema);
