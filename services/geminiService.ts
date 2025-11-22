import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API Key is missing. Please ensure process.env.API_KEY is set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 representing the overall quality of the original writing.",
    },
    summary: {
      type: Type.STRING,
      description: "A brief, encouraging summary of the text's quality and the main areas improved.",
    },
    rewrittenText: {
      type: Type.STRING,
      description: "The fully rewritten text with all grammar, spelling, and style issues corrected.",
    },
    markedUpText: {
      type: Type.STRING,
      description: "The text with HTML tags highlighting changes. Use <span class='bg-red-100 text-red-700 line-through px-1 rounded-sm'>deleted text</span> for removals and <span class='bg-green-100 text-green-800 px-1 font-medium rounded-sm'>added text</span> for additions. Ensure the text is properly escaped outside of these tags.",
    },
    improvements: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: "A concise reason why a specific change made the text better (e.g., 'Fixed subject-verb agreement', 'Improved sentence flow').",
      },
    },
  },
  required: ["score", "summary", "rewrittenText", "markedUpText", "improvements"],
};

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  if (!text.trim()) {
    throw new Error("Please enter some text to analyze.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert professional editor. Your goal is to review the user's text and provide a "Track Changes" style output.
      
      Text to review:
      "${text}"
      
      1. Correct all grammar and spelling errors.
      2. Improve style, clarity, and flow.
      3. Provide a 'rewrittenText' which is the clean, final version.
      4. Provide a 'markedUpText' which visually shows the diffs between the original and the new version using the specified HTML classes for deletions and additions.
      5. List the key reasons for your changes in 'improvements'.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1, 
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("No response received from the model.");
    }
  } catch (error) {
    console.error("Error analyzing text:", error);
    throw error;
  }
};
