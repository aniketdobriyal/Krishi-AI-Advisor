import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const backendEnv = path.join(process.cwd(), "backend", ".env");
if (fs.existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv });
} else {
  dotenv.config();
}

const apiKey = process.env.GEMINI_API_KEY;

export const getGeminiModel = () => {
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

export const hasApiKey = () => {
  return !!(apiKey && apiKey.trim() !== "");
};
