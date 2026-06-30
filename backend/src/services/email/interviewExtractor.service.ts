import { InterviewDetails } from "../../types/email.types";

export const extractInterviewDetails = (subject: string, body: string): InterviewDetails => {
  const text = `${subject}\n${body}`;
  const meetingLink = extractMeetingLink(text);

  return {
    company: extractCompany(text),
    role: extractRole(text),
    date: extractDate(text),
    time: extractTime(text),
    location: extractLocation(text),
    meetingLink,
    meetingPlatform: detectMeetingPlatform(text, meetingLink),
    round: extractRound(text),
  };
};

const extractCompany = (text: string): string | undefined => {
  return matchFirst(text, /(?:with|at)\s+([A-Z][A-Za-z0-9 &.-]{2,40})/);
};

const extractRole = (text: string): string | undefined => {
  return matchFirst(text, /(?:for|role[:\s]+|position[:\s]+)\s+([A-Z][A-Za-z0-9 &.-]{2,60})/);
};

const extractDate = (text: string): string | undefined => {
  return matchFirst(
    text,
    /\b(\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4})\b/i
  );
};

const extractTime = (text: string): string | undefined => {
  return matchFirst(text, /\b(\d{1,2}:\d{2}\s?(?:am|pm)?|\d{1,2}\s?(?:am|pm))\b/i);
};

const extractLocation = (text: string): string | undefined => {
  return matchFirst(text, /(?:location|venue)[:\s]+([A-Za-z0-9 ,.-]{3,80})/i);
};

const extractMeetingLink = (text: string): string | undefined => {
  return matchFirst(text, /(https?:\/\/(?:meet\.google\.com|[\w.-]*zoom\.us|teams\.microsoft\.com)[^\s]+)/i);
};

const detectMeetingPlatform = (
  text: string,
  meetingLink?: string
): InterviewDetails["meetingPlatform"] => {
  const searchable = `${text} ${meetingLink || ""}`.toLowerCase();

  if (searchable.includes("meet.google.com") || searchable.includes("google meet")) {
    return "GOOGLE_MEET";
  }

  if (searchable.includes("zoom.us") || searchable.includes("zoom")) {
    return "ZOOM";
  }

  if (searchable.includes("teams.microsoft.com") || searchable.includes("teams")) {
    return "TEAMS";
  }

  return meetingLink ? "OTHER" : undefined;
};

const extractRound = (text: string): string | undefined => {
  return matchFirst(
    text,
    /\b(HR round|technical round|final round|coding round|managerial round|system design round|interview)\b/i
  );
};

const matchFirst = (text: string, regex: RegExp): string | undefined => {
  const match = text.match(regex);
  return match?.[1]?.trim();
};
