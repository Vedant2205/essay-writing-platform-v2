import axios from 'axios';
require('dotenv').config();  

const evaluateEssay = async (exam_id, essay_text) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

    console.log('Evaluating essay:', essay_text);

    const prompt = `
You are an expert essay evaluator. Please evaluate the following essay:

Essay Text:
"""
${essay_text}
"""

Please provide your evaluation in the following format:
1. Score: [Give a score out of 100]
2. Detailed Feedback:
   - Content Analysis
   - Structure Analysis
   - Grammar and Style
3. Word Count: [Provide word count]
4. Areas for Improvement:
   - [List specific areas]

Please be thorough in your evaluation.`;

    const data = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    console.log('Sending request to Gemini API with payload:', JSON.stringify(data, null, 2));

    const response = await axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Gemini API Raw Response:', JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
      throw new Error('Unexpected response structure from Gemini API');
    }

    const evaluationText = response.data.candidates[0]?.content?.parts?.[0]?.text || '';

    if (!evaluationText) {
      throw new Error('Invalid response format from Gemini API');
    }

    console.log('Raw evaluation text:', evaluationText);

    const score = extractScore(evaluationText);
    console.log('Extracted score:', score);

    const feedback = formatFeedback(evaluationText);
    console.log('Formatted feedback:', feedback);

    const wordCount = countWords(essay_text);
    const characterCount = essay_text.length;

    const result = {
      score,
      feedback,
      word_count: wordCount,
      character_count: characterCount,
      raw_evaluation: evaluationText,
    };

    console.log('Processed evaluation result:', result);

    return result;
  } catch (error) {
    console.error('Error evaluating essay with Gemini API:', error.message || error);
    throw error;
  }
};

const extractScore = (text) => {
  try {
    const scoreMatch = text.match(/Score:\s*(\d+)\s*out of/);
    if (scoreMatch) return parseInt(scoreMatch[1], 10);
    const fallbackMatch = text.match(/\b(\d{1,3})\s*\/\s*100\b/);
    return fallbackMatch ? parseInt(fallbackMatch[1], 10) : 0;
  } catch (error) {
    console.error('Error extracting score:', error);
    return 0;
  }
};

const formatFeedback = (text) => {
  try {
    return text
      .split('\n')
      .filter((line) => !line.startsWith('1. Score:') && !line.startsWith('3. Word Count:'))
      .join('\n')
      .trim();
  } catch (error) {
    console.error('Error formatting feedback:', error);
    return 'Error processing feedback';
  }
};

const countWords = (text) => {
  try {
    return text.trim().split(/\s+/).length;
  } catch (error) {
    console.error('Error counting words:', error);
    return 0;
  }
};

export default evaluateEssay;
