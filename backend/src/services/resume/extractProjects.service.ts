import {
  getSectionText,
  toCleanLines,
  uniqueStrings,
} from "../../utils/resumeParser";

export const extractProjects = (text: string): string[] => {
  const section = getSectionText(text, ["projects"]);

  if (!section) {
    return [];
  }

  const lines = toCleanLines(section);
  const projects = lines.filter((line) => {
    return (
      /project|application|platform|system|website|app/i.test(line) ||
      /github|live|demo|built|developed|implemented/i.test(line)
    );
  });

  return uniqueStrings(projects.length ? projects : lines).slice(0, 30);
};
