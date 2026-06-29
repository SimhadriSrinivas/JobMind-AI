export const orderResumeSections = (
  jobDescription: string,
  hasProjects: boolean
): string[] => {
  const description = jobDescription.toLowerCase();

  if (description.includes("project") && hasProjects) {
    return ["summary", "skills", "projects", "experience", "education"];
  }

  if (description.includes("experience") || description.includes("senior")) {
    return ["summary", "experience", "skills", "projects", "education"];
  }

  return ["summary", "skills", "experience", "projects", "education"];
};
