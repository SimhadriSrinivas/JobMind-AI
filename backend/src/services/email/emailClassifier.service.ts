import { EmailClassification, EmailEventInput } from "../../types/email.types";
import { getSearchableEmailText } from "./emailParser.service";

export const classifyEmail = (email: EmailEventInput): EmailClassification => {
  const text = getSearchableEmailText(email);

  if (matches(text, ["unsubscribe", "newsletter", "weekly digest"])) {
    return "NEWSLETTER";
  }

  if (matches(text, ["withdraw your application", "application withdrawn"])) {
    return "WITHDRAWAL";
  }

  if (
    matches(text, [
      "not be moving forward",
      "not moving forward",
      "regret to inform",
      "unfortunately",
      "not selected",
    ])
  ) {
    return "REJECTION";
  }

  if (matches(text, ["offer letter", "pleased to offer", "compensation", "joining date"])) {
    return "OFFER";
  }

  if (matches(text, ["final round", "final interview"])) {
    return "FINAL_ROUND";
  }

  if (matches(text, ["technical round", "coding round", "system design"])) {
    return "TECHNICAL_ROUND";
  }

  if (matches(text, ["hr round", "hr interview"])) {
    return "HR_ROUND";
  }

  if (matches(text, ["interview", "google meet", "zoom", "microsoft teams"])) {
    return "INTERVIEW";
  }

  if (matches(text, ["assessment", "assignment", "online test", "coding test"])) {
    return "ASSESSMENT";
  }

  if (matches(text, ["under review", "reviewing your application"])) {
    return "UNDER_REVIEW";
  }

  if (matches(text, ["application received", "application confirmation", "thank you for applying"])) {
    return "APPLICATION_CONFIRMATION";
  }

  return "UNKNOWN";
};

const matches = (text: string, terms: string[]): boolean => {
  return terms.some((term) => text.includes(term));
};
