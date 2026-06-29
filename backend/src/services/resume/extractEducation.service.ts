import {
  getSectionText,
  toCleanLines,
  uniqueStrings,
} from "../../utils/resumeParser";

export const extractEducation = (text: string): string[] => {
  const section = getSectionText(text, ["education"]);

  if (!section) {
    return [];
  }

  const lines = toCleanLines(section);
  const education = lines.filter((line) => {
    return /degree|bachelor|master|university|college|school|institute|gpa|cgpa|b\.?tech|m\.?tech|bsc|msc|mba/i.test(
      line
    );
  });

  return uniqueStrings(education.length ? education : lines).slice(0, 20);
};
