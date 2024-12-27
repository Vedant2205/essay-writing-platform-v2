import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key is defined in environment variables
if (!process.env.REACT_APP_GEMINI_API_KEY) {
  throw new Error("Gemini API key is not defined in the environment variables.");
}

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export async function evaluateEssay(prompt, essayText) {
  try {
    // Choose the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Craft a detailed evaluation prompt
    const evaluationPrompt = `
      Act as a professional essay grader. Evaluate the following essay based on these criteria:
      1. Ideas and Analysis (0-5 points)
      2. Writing Style (0-5 points)
      3. Overall Coherence (0-5 points)

      Essay Prompt: ${prompt}

      Essay Text: ${essayText}

      Provide a detailed evaluation including:
      - Total Score (out of 10)
      - Score breakdown for each criteria
      - Specific feedback for improvement
      - Word count
      - Character count

      Format your response as a JSON object with the following structure:
      {
        "totalScore": number,
        "wordCount": number,
        "characterCount": number,
        "overallFeedback": "string",
        "criteriaScores": [
          {
            "name": "string",
            "score": number,
            "feedback": "string"
          }
        ]
      }
    `;

    // Generate the response from Gemini
    const result = await model.generateContent(evaluationPrompt);

    // Assuming the response is a JSON string, parse it safely
    const parsedResponse = result.response ? JSON.parse(result.response) : {};

    // Validate response structure
    if (!parsedResponse.totalScore) {
      throw new Error("Invalid response from Gemini API: Missing totalScore.");
    }

    return parsedResponse;
  } catch (error) {
    console.error("Gemini API Evaluation Error:", error);

    // Fallback error handling with detailed feedback
    return {
      totalScore: 0,
      wordCount: essayText.trim().split(/\s+/).length,
      characterCount: essayText.length,
      overallFeedback: `Error in essay evaluation. Please try again. ${error.message}`,
      criteriaScores: [
        {
          name: "Ideas and Analysis",
          score: 0,
          feedback: "Unable to evaluate due to API error."
        },
        {
          name: "Writing Style",
          score: 0,
          feedback: "Unable to evaluate due to API error."
        },
        {
          name: "Overall Coherence",
          score: 0,
          feedback: "Unable to evaluate due to API error."
        }
      ]
    };
  }
}
