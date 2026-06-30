import { OfferDetails } from "../../types/email.types";

export const extractOfferDetails = (subject: string, body: string): OfferDetails => {
  const text = `${subject}\n${body}`;

  return {
    salary: extractSalary(text),
    currency: extractCurrency(text),
    joiningDate: extractJoiningDate(text),
    role: extractRole(text),
    company: extractCompany(text),
  };
};

const extractSalary = (text: string): number | undefined => {
  const match = text.match(/(?:salary|compensation|ctc)[^\d]*(?:inr|rs\.?|₹|\$|usd)?\s?([\d,]+(?:\.\d+)?)/i);

  if (!match?.[1]) {
    return undefined;
  }

  const parsed = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
};

const extractCurrency = (text: string): string | undefined => {
  if (/\b(inr|rs\.?|₹)\b/i.test(text)) {
    return "INR";
  }

  if (/\b(usd|\$)\b/i.test(text)) {
    return "USD";
  }

  return undefined;
};

const extractJoiningDate = (text: string): string | undefined => {
  return matchFirst(
    text,
    /(?:joining date|start date)[:\s]+(\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i
  );
};

const extractRole = (text: string): string | undefined => {
  return matchFirst(text, /(?:role|position|for)[:\s]+([A-Z][A-Za-z0-9 &.-]{2,60})/);
};

const extractCompany = (text: string): string | undefined => {
  return matchFirst(text, /(?:at|with)\s+([A-Z][A-Za-z0-9 &.-]{2,40})/);
};

const matchFirst = (text: string, regex: RegExp): string | undefined => {
  const match = text.match(regex);
  return match?.[1]?.trim();
};
