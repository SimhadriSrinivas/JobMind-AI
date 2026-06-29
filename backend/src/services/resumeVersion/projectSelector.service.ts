export const selectRelevantProjects = (
  projects: string[],
  jobSkills: string[],
  jobDescription: string
): string[] => {
  const terms = [...jobSkills, ...jobDescription.split(/\W+/)]
    .map((term) => term.trim().toLowerCase())
    .filter((term) => term.length > 2);

  return [...projects]
    .sort((first, second) => {
      return scoreProject(second, terms) - scoreProject(first, terms);
    })
    .slice(0, 4);
};

const scoreProject = (project: string, terms: string[]): number => {
  const normalizedProject = project.toLowerCase();
  return terms.reduce((score, term) => {
    return normalizedProject.includes(term) ? score + 1 : score;
  }, 0);
};
