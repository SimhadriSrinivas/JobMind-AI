import { DecisionScoreInput } from "../../types/decision.types";

export const calculateResumeMatch = (input: DecisionScoreInput) => {
  if (input.resumeVersionMatchPercentage !== undefined) {
    return clamp(input.resumeVersionMatchPercentage);
  }

  const resumeSkills = normalize(input.resumeSkills);
  const jobSkills = normalize(input.jobSkills);

  if (jobSkills.length === 0) {
    return 0;
  }

  const matchedSkills = jobSkills.filter((skill) => resumeSkills.includes(skill));
  return Math.round((matchedSkills.length / jobSkills.length) * 100);
};

export const calculateExperienceMatch = (input: DecisionScoreInput) => {
  if (input.jobExperience === undefined || input.jobExperience <= 0) {
    return 80;
  }

  const profileExperience = input.profileExperienceYears || 0;

  if (profileExperience >= input.jobExperience) {
    return 100;
  }

  const gap = input.jobExperience - profileExperience;
  return clamp(100 - gap * 18);
};

export const calculateLocationMatch = (input: DecisionScoreInput) => {
  if (!input.jobLocation) {
    return 70;
  }

  const jobLocation = input.jobLocation.toLowerCase();
  const preferredLocations = (input.preferredLocations || []).map((location) => {
    return location.toLowerCase();
  });

  if (preferredLocations.length === 0) {
    return 65;
  }

  return preferredLocations.some((location) => jobLocation.includes(location))
    ? 100
    : 40;
};

export const calculateRemoteMatch = (input: DecisionScoreInput) => {
  if (input.remotePreference === "NO_PREFERENCE" || !input.remotePreference) {
    return 75;
  }

  if (input.remotePreference === "REMOTE") {
    return input.isRemote ? 100 : 35;
  }

  if (input.remotePreference === "ONSITE") {
    return input.isRemote ? 55 : 100;
  }

  return input.isRemote ? 85 : 75;
};

export const getMissingSkills = (
  resumeSkills: string[],
  jobSkills: string[]
): string[] => {
  const normalizedResumeSkills = normalize(resumeSkills);

  return jobSkills.filter((skill) => {
    return !normalizedResumeSkills.includes(skill.trim().toLowerCase());
  });
};

const normalize = (skills: string[]): string[] => {
  return Array.from(new Set(skills.map((skill) => skill.trim().toLowerCase()).filter(Boolean)));
};

const clamp = (score: number): number => {
  return Math.max(0, Math.min(Math.round(score), 100));
};
