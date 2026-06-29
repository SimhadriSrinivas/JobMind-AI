import { ApiError } from "../../utils/ApiError";
import { parsePdfToText } from "../../utils/resumeParser";

export const parseResume = async (filePath: string): Promise<string> => {
  try {
    const parsedText = await parsePdfToText(filePath);

    if (!parsedText) {
      throw new ApiError(422, "Unable to extract text from resume");
    }

    return parsedText;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(422, "Unable to parse resume PDF");
  }
};
