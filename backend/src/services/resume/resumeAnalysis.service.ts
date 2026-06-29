import { ResumeSections } from "../../types/resume.types";
import { extractEducation } from "./extractEducation.service";
import { extractExperience } from "./extractExperience.service";
import { extractProjects } from "./extractProjects.service";
import { extractSkills } from "./extractSkills.service";

export const analyzeResume = (parsedText: string): ResumeSections => {
  return {
    skills: extractSkills(parsedText),
    projects: extractProjects(parsedText),
    education: extractEducation(parsedText),
    experience: extractExperience(parsedText),
  };
};
