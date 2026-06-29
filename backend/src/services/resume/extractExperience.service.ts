import {
  getSectionText,
  toCleanLines,
  uniqueStrings,
} from "../../utils/resumeParser";

export const extractExperience = (text: string): string[] => {
  const section = getSectionText(text, [
    "experience",
    "work experience",
    "professional experience",
    "employment",
  ]);

  if (!section) {
    return [];
  }

  const lines = toCleanLines(section);
  const experience = lines.filter((line) => {
    return /engineer|developer|intern|manager|consultant|analyst|company|worked|developed|managed|led|built|implemented|\d+\+?\s*(years|yrs)/i.test(
      line
    );
  });

  return uniqueStrings(experience.length ? experience : lines).slice(0, 30);
};
