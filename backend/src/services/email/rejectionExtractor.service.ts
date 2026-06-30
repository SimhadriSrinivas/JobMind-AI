import { RejectionDetails } from "../../types/email.types";

export const extractRejectionDetails = (subject: string, body: string): RejectionDetails => {
  const text = `${subject} ${body}`.toLowerCase();
  const rejected =
    text.includes("not be moving forward") ||
    text.includes("not moving forward") ||
    text.includes("regret to inform") ||
    text.includes("not selected") ||
    text.includes("unfortunately");

  return {
    rejected,
    reason: rejected ? "Rejection language detected in email" : undefined,
  };
};
