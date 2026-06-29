import mongoose, { Document, Schema, Types } from "mongoose";
import {
  ApplicationPriority,
  ApplicationSource,
  ApplicationStatus,
  applicationPriorities,
  applicationSources,
  applicationStatuses,
} from "../types/application.types";

export interface IApplicationTimelineItem {
  title: string;
  description?: string;
  date: Date;
  attachments: string[];
  metadata?: Record<string, unknown>;
}

export interface IApplication extends Document {
  userId: Types.ObjectId;
  jobId: Types.ObjectId;
  resumeId: Types.ObjectId;
  resumeVersionId?: Types.ObjectId | null;
  coverLetterId?: Types.ObjectId | null;
  companyId: Types.ObjectId;
  status: ApplicationStatus;
  applicationSource: ApplicationSource;
  appliedDate?: Date;
  lastUpdated: Date;
  notes?: string;
  timeline: IApplicationTimelineItem[];
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterLinkedIn?: string;
  interviewDate?: Date;
  interviewMode?: string;
  assessmentLink?: string;
  offerAmount?: number;
  currency?: string;
  expectedSalary?: number;
  currentSalary?: number;
  priority: ApplicationPriority;
  bookmarked: boolean;
  archived: boolean;
  metadata: Record<string, unknown>;
  integrations: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const timelineSchema = new Schema<IApplicationTimelineItem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    attachments: {
      type: [String],
      default: [],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    _id: false,
  }
);

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    resumeVersionId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    coverLetterId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: applicationStatuses,
      default: "SAVED",
      index: true,
    },
    applicationSource: {
      type: String,
      enum: applicationSources,
      default: "Manual",
    },
    appliedDate: {
      type: Date,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    timeline: {
      type: [timelineSchema],
      default: [],
    },
    recruiterName: {
      type: String,
      trim: true,
    },
    recruiterEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    recruiterLinkedIn: {
      type: String,
      trim: true,
    },
    interviewDate: {
      type: Date,
    },
    interviewMode: {
      type: String,
      trim: true,
    },
    assessmentLink: {
      type: String,
      trim: true,
    },
    offerAmount: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: "USD",
    },
    expectedSalary: {
      type: Number,
      min: 0,
    },
    currentSalary: {
      type: Number,
      min: 0,
    },
    priority: {
      type: String,
      enum: applicationPriorities,
      default: "MEDIUM",
      index: true,
    },
    bookmarked: {
      type: Boolean,
      default: false,
      index: true,
    },
    archived: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    integrations: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ userId: 1, status: 1, lastUpdated: -1 });

export default mongoose.model<IApplication>("Application", applicationSchema);
