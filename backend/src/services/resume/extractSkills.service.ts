import {
  getSectionText,
  toCleanLines,
  uniqueStrings,
} from "../../utils/resumeParser";

const knownSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "Mongoose",
  "Python",
  "Java",
  "C++",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "REST",
  "GraphQL",
  "HTML",
  "CSS",
  "Tailwind",
  "Next.js",
  "Redux",
];

export const extractSkills = (text: string): string[] => {
  const skillsSection = getSectionText(text, ["skills", "technical skills"]);
  const sectionSkills = skillsSection
    .split(/[,|•\n]/)
    .map((skill) => skill.trim())
    .filter((skill) => /^[A-Za-z0-9+#./ -]{2,40}$/.test(skill));

  const matchedSkills = knownSkills.filter((skill) => {
    const pattern = new RegExp(`\\b${escapeSkill(skill)}\\b`, "i");
    return pattern.test(text);
  });

  return uniqueStrings([...sectionSkills, ...matchedSkills]).slice(0, 80);
};

const escapeSkill = (skill: string): string => {
  return skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
