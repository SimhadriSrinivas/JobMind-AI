import mongoose, { Document, Schema, Types } from "mongoose";
import {
  EmailAttachment,
  EmailClassification,
  InterviewDetails,
  OfferDetails,
  ParsedEmailData,
  emailClassifications,
} from "../types/email.types";

export interface IEmailEvent extends Document {
  userId: Types.ObjectId;
  applicationId?: Types.ObjectId | null;
  campaignId?: Types.ObjectId | null;
  messageId: string;
  threadId: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  receivedAt: Date;
  classification: EmailClassification;
  attachments: EmailAttachment[];
  interviewDetails?: InterviewDetails;
  offerDetails?: OfferDetails;
  parsedData: ParsedEmailData;
  isProcessed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new Schema<EmailAttachment>(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      trim: true,
    },
    size: {
      type: Number,
      min: 0,
    },
    url: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const emailEventSchema = new Schema<IEmailEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      default: null,
      index: true,
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      default: null,
      index: true,
    },
    messageId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    threadId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    from: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    to: {
      type: [String],
      required: true,
      default: [],
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    receivedAt: {
      type: Date,
      required: true,
      index: true,
    },
    classification: {
      type: String,
      enum: emailClassifications,
      default: "UNKNOWN",
      index: true,
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    interviewDetails: {
      type: Schema.Types.Mixed,
    },
    offerDetails: {
      type: Schema.Types.Mixed,
    },
    parsedData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isProcessed: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

emailEventSchema.index({ userId: 1, messageId: 1 }, { unique: true });
emailEventSchema.index({ userId: 1, classification: 1, receivedAt: -1 });

export default mongoose.model<IEmailEvent>("EmailEvent", emailEventSchema);
