import { VertexAI } from "@google-cloud/vertexai";

// Initialize Vertex AI with project and location
// This requires GOOGLE_CLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS to be set
const projectId = process.env.GOOGLE_CLOUD_PROJECT;
if (!projectId) {
  throw new Error("GOOGLE_CLOUD_PROJECT environment variable is not set.");
}

const location = "us-central1";

const vertexAi = new VertexAI({
  project: projectId,
  location: location,
});

export const geminiModel = vertexAi.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.1,
    responseMimeType: "application/json",
  },
});
