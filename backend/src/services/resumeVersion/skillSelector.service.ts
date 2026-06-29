export const selectRelevantSkills = (
  resumeSkills: string[],
  jobSkills: string[],
  jobDescription: string
) => {
  const normalizedResumeSkills = uniqueStrings(resumeSkills);
  const normalizedJobSkills = uniqueStrings(jobSkills);
  const description = jobDescription.toLowerCase();

  const matchedSkills = normalizedResumeSkills.filter((skill) => {
    return normalizedJobSkills.includes(skill) || description.includes(skill.toLowerCase());
  });

  const addedSkills = normalizedJobSkills.filter((skill) => {
    return !normalizedResumeSkills.includes(skill);
  });

  const selectedSkills = uniqueStrings([
    ...matchedSkills,
    ...normalizedResumeSkills.filter((skill) => description.includes(skill.toLowerCase())),
    ...normalizedResumeSkills,
  ]).slice(0, 18);

  const removedSkills = normalizedResumeSkills.filter((skill) => {
    return !selectedSkills.includes(skill);
  });

  return {
    selectedSkills,
    addedSkills,
    removedSkills,
  };
};

const uniqueStrings = (items: string[]): string[] => {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
};
