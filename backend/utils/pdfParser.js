import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<{text: string, numPages: number}>}
 */

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const parser = new PDFParse(new Uint8Array(dataBuffer)); //pdf-parse expects a Uint8Array
    const data = await parser.getText();

    return {
      text: data.text,
      numPages: data.numPages, //This might not be correct
      info: data.info, //This might not be correct
    };
  } catch (error) {
    console.error("PDF parsing error: ", error);
    throw new Error("Failed to extract text from PDF");
  }
};
