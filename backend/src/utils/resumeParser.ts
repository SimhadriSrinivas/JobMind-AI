import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

const sectionHeadings = [
  "summary",
  "objective",
  "profile",
  "skills",
  "technical skills",
  "education",
  "projects",
  "experience",
  "work experience",
  "professional experience",
  "employment",
  "certifications",
  "achievements",
];

export const parsePdfToText = async (filePath: string): Promise<string> => {
  const fileBuffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: new Uint8Array(fileBuffer) });

  try {
    const result = await parser.getText({
      lineEnforce: true,
      pageJoiner: "\n",
    });

    return normalizeResumeText(result.text);
  } finally {
    await parser.destroy();
  }
};

export const normalizeResumeText = (text: string): string => {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const getSectionText = (text: string, headings: string[]): string => {
  const headingPattern = headings.map(escapeRegExp).join("|");
  const allHeadingsPattern = sectionHeadings.map(escapeRegExp).join("|");
  const regex = new RegExp(
    `(?:^|\\n)\\s*(?:${headingPattern})\\s*:?\\s*\\n([\\s\\S]*?)(?=\\n\\s*(?:${allHeadingsPattern})\\s*:?\\s*\\n|$)`,
    "i"
  );

  return regex.exec(text)?.[1]?.trim() || "";
};

export const toCleanLines = (text: string): string[] => {
  return text
    .split("\n")
    .map((line) => line.replace(/^[\s•\-–*]+/, "").trim())
    .filter((line) => line.length > 1);
};

export const uniqueStrings = (items: string[]): string[] => {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
};

const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
