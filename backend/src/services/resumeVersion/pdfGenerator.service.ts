import fs from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { GeneratedResumeJson } from "../../types/resumeVersion.types";

const generatedResumeDir = path.resolve(process.cwd(), "generated_resumes");

export const generateResumePdf = async (
  resumeJson: GeneratedResumeJson,
  userId: string
): Promise<string> => {
  await fs.mkdir(generatedResumeDir, { recursive: true });

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([612, 792]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let y = 748;

  const drawText = (text: string, size = 10, bold = false) => {
    const lines = wrapText(text, size > 11 ? 76 : 92);

    lines.forEach((line) => {
      if (y < 54) {
        page = pdfDoc.addPage([612, 792]);
        y = 748;
      }

      page.drawText(line, {
        x: 48,
        y,
        size,
        font: bold ? boldFont : font,
        color: rgb(0.08, 0.1, 0.14),
      });
      y -= size + 5;
    });
  };

  drawText(resumeJson.jobTitle, 16, true);
  y -= 4;

  resumeJson.sectionOrder.forEach((section) => {
    const value = resumeJson[section as keyof GeneratedResumeJson];

    if (!value || (Array.isArray(value) && value.length === 0)) {
      return;
    }

    drawText(section.toUpperCase(), 11, true);

    if (Array.isArray(value)) {
      value.slice(0, section === "skills" ? 18 : 6).forEach((item) => {
        drawText(`• ${item}`, 9);
      });
    } else {
      drawText(value.toString(), 9);
    }

    y -= 6;
  });

  const pdfBytes = await pdfDoc.save();
  const fileName = `${userId}-${Date.now()}.pdf`;
  const filePath = path.join(generatedResumeDir, fileName);

  await fs.writeFile(filePath, pdfBytes);

  return filePath;
};

const wrapText = (text: string, maxLength: number): string[] => {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxLength) {
      lines.push(currentLine);
      currentLine = word;
      return;
    }

    currentLine = nextLine;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};
