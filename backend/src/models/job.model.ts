import mongoose, { Document, Schema, Types } from "mongoose";

export interface IJob extends Document {
  companyId: Types.ObjectId;
  title: string;
  description: string;
  location?: string;
  employmentType?: string;
  experience?: number;
  salary?: number;
  currency?: string;
  skills: string[];
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  applicationUrl?: string;
  source?: string;
  postedDate?: Date;
  deadline?: Date;
  isRemote: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      index: true,
    },
    employmentType: {
      type: String,
      trim: true,
      index: true,
    },
    experience: {
      type: Number,
      min: 0,
    },
    salary: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: "USD",
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    qualifications: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    applicationUrl: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    isRemote: {
      type: Boolean,
      default: false,
      index: true,
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

jobSchema.index({
  title: "text",
  description: "text",
  skills: "text",
  location: "text",
});

export default mongoose.model<IJob>("Job", jobSchema);
