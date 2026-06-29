import {
  ResumeVersionScore,
  ResumeVersionScoringInput,
} from "../../types/resumeVersion.types";

export const scoreResumeVersion = ({
  resumeSkills,
  jobSkills,
  selectedProjects,
  jobDescription,
}: ResumeVersionScoringInput): ResumeVersionScore => {
  const normalizedResumeSkills = normalize(resumeSkills);
  const normalizedJobSkills = normalize(jobSkills);
  const matchedSkills = normalizedJobSkills.filter((skill) => {
    return normalizedResumeSkills.includes(skill);
  });
  const missingSkills = normalizedJobSkills.filter((skill) => {
    return !normalizedResumeSkills.includes(skill);
  });
  const matchPercentage =
    normalizedJobSkills.length > 0
      ? Math.round((matchedSkills.length / normalizedJobSkills.length) * 100)
      : 0;
  const projectScore = selectedProjects.length > 0 ? 15 : 0;
  const keywordScore = calculateKeywordScore(jobDescription, resumeSkills);
  const atsScore = Math.min(
    100,
    Math.round(matchPercentage * 0.7 + projectScore + keywordScore)
  );

  return {
    atsScore,
    matchPercentage,
    missingSkills: restoreLabels(missingSkills, jobSkills),
    addedSkills: restoreLabels(missingSkills, jobSkills),
    removedSkills: [],
  };
};

const normalize = (skills: string[]): string[] => {
  return Array.from(new Set(skills.map((skill) => skill.trim().toLowerCase()).filter(Boolean)));
};

const restoreLabels = (skillKeys: string[], labels: string[]): string[] => {
  return skillKeys.map((skillKey) => {
    return labels.find((skill) => skill.trim().toLowerCase() === skillKey) || skillKey;
  });
};

const calculateKeywordScore = (jobDescription: string, resumeSkills: string[]): number => {
  const description = jobDescription.toLowerCase();
  const keywordHits = resumeSkills.filter((skill) => {
    return description.includes(skill.toLowerCase());
  }).length;

  return Math.min(keywordHits * 2, 15);
};
