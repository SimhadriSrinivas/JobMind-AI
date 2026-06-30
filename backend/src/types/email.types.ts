import { Types } from "mongoose";

export const emailClassifications = [
  "UNKNOWN",
  "APPLICATION_CONFIRMATION",
  "UNDER_REVIEW",
  "ASSESSMENT",
  "INTERVIEW",
  "HR_ROUND",
  "TECHNICAL_ROUND",
  "FINAL_ROUND",
  "OFFER",
  "REJECTION",
  "WITHDRAWAL",
  "NEWSLETTER",
] as const;

export type EmailClassification = (typeof emailClassifications)[number];

export interface EmailAttachment {
  filename: string;
  mimeType?: string;
  size?: number;
  url?: string;
}

export interface InterviewDetails {
  company?: string;
  role?: string;
  date?: string;
  time?: string;
  location?: string;
  meetingLink?: string;
  meetingPlatform?: "GOOGLE_MEET" | "ZOOM" | "TEAMS" | "OTHER";
  round?: string;
}

export interface OfferDetails {
  salary?: number;
  currency?: string;
  joiningDate?: string;
  role?: string;
  company?: string;
}

export interface RejectionDetails {
  rejected: boolean;
  reason?: string;
}

export interface ParsedEmailData {
  interviewDetails?: InterviewDetails;
  offerDetails?: OfferDetails;
  rejectionDetails?: RejectionDetails;
  notificationEvent?: {
    type: string;
    title: string;
    message: string;
  };
  metadata?: Record<string, unknown>;
}

export interface EmailProviderMessage {
  messageId: string;
  threadId: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  receivedAt: Date | string;
  attachments?: EmailAttachment[];
  applicationId?: string | Types.ObjectId;
  campaignId?: string | Types.ObjectId;
}

export interface EmailEventInput extends EmailProviderMessage {
  classification?: EmailClassification;
}

export interface EmailSyncInput {
  applicationId?: string | Types.ObjectId;
  campaignId?: string | Types.ObjectId;
  limit?: number;
}

export interface EmailClassifyInput {
  eventId?: string;
  email?: EmailProviderMessage;
}
