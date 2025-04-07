import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Renamed to match the import in essayService.js
const evaluateEssay = async (exam_id, essay_text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = `
You are an expert examiner for various exams, including IELTS, TOEFL, GMAT, SAT, and ACT. Analyze the following essay submitted for Exam ID: ${exam_id}.
Give a score out of 100, no bands, and provide detailed feedback.

${
  exam_id === 'IELTS' 
    ? `For IELTS, evaluate the essay based on:
    - Task response and coherence of ideas
    - Range and accuracy of vocabulary
    - Grammar and sentence structure
    - Spelling and punctuation`
  : exam_id === 'TOEFL'
    ? `For TOEFL, evaluate the essay based on:
    - Clarity and development of ideas
    - Proper use of grammar and vocabulary
    - Logical structure and organization
    - Accurate spelling and punctuation`
  : exam_id === 'GMAT'
    ? `For GMAT, evaluate the essay based on:
    - Argument analysis and reasoning
    - Clarity and organization of ideas
    - Grammar and language precision
    - Spelling and punctuation`
  : exam_id === 'SAT'
    ? `For SAT, evaluate the essay based on:
    - Argument clarity and coherence
    - Sentence structure and grammar
    - Vocabulary and idea development
    - Spelling and punctuation`
  : exam_id === 'ACT'
    ? `For ACT, evaluate the essay based on:
    - Structure and organization of ideas
    - Grammar and usage
    - Coherence and relevance of arguments
    - Spelling and punctuation`
  : `For the exam with ID: ${exam_id}, please evaluate the essay based on general criteria: clarity, coherence, argumentation, grammar, vocabulary, and spelling.`
}

Essay:
${essay_text}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Extract score from feedback (look for "**Overall Score: X / 100**")
    let extractedScore = 0;
    const scoreMatch = text.match(/\*\*Overall Score:\s*(\d+)\s*\/\s*100\*\*/);
    if (scoreMatch && scoreMatch[1]) {
      extractedScore = parseInt(scoreMatch[1]);
    }

    return {
      score: extractedScore, // Store score separately
      feedback: text, // Full feedback text
      word_count: essay_text.split(/\s+/).length,
      character_count: essay_text.length,
    };
  } catch (error) {
    console.error("Error in Gemini API:", error);
    throw error;
  }
};

export default evaluateEssay;
