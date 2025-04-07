import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


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
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    console.log('Sending request to Gemini API with payload:', JSON.stringify(data, null, 2));

    const response = await axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Gemini API Raw Response:', JSON.stringify(response.data, null, 2));

    const evaluationText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
if (!evaluationText.trim()) {
  throw new Error('Invalid or empty response from Gemini API');
}

    if (!evaluationText) {
      throw new Error('Invalid response format from Gemini API');
    }

    // Log the raw evaluation text for debugging
    console.log('Raw evaluation text:', evaluationText);

    // Process the evaluation
    const score = extractScore(evaluationText);
    console.log('Extracted score:', score); // Debug log

    const feedback = formatFeedback(evaluationText);
    console.log('Formatted feedback:', feedback); // Debug log

    const wordCount = countWords(essay_text);
    const characterCount = essay_text.length;

    const result = {
      score: score,
      feedback: feedback,
      word_count: wordCount,
      character_count: characterCount,
      raw_evaluation: evaluationText,
    };

    console.log('Processed evaluation result:', result);

    return result;

  } catch (error) {
    console.error('Error evaluating essay with Gemini API:', error);
    throw error;
  }
};

const extractScore = (text) => {
  try {
    // First try to match "Score: X out of 100" pattern
    const scoreMatch = text.match(/Score:\s*(\d+)\s*out of/);
    
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1], 10);
      console.log('Found score in text:', score); // Debug log
      return (score >= 0 && score <= 100) ? score : 0;  // Return as number
    }
    
    // Fallback: try to match any number followed by /100
    const fallbackMatch = text.match(/\b(\d{1,3})\s*\/\s*100\b/);
    if (fallbackMatch) {
      const score = parseInt(fallbackMatch[1], 10);
      console.log('Found score using fallback:', score); // Debug log
      return (score >= 0 && score <= 100) ? score : 0;  // Return as number
    }

    console.log('No valid score found in text'); // Debug log
    return 0;  // Default to 0 if no valid score found
  } catch (error) {
    console.error('Error extracting score:', error);
    return 0;  // Return 0 in case of an error
  }
};

const formatFeedback = (text) => {
  try {
    // Split the text into lines
    const lines = text.split('\n');
    
    // Filter out the score and word count sections
    const relevantLines = lines.filter(line => {
      const trimmedLine = line.trim();
      return !trimmedLine.startsWith('1. Score:') && 
             !trimmedLine.startsWith('3. Word Count:') &&
             trimmedLine !== '';
    });
    
    // Join the remaining lines back together
    const formattedFeedback = relevantLines.join('\n').trim();
    
    console.log('Formatted feedback:', formattedFeedback); // Debug log
    return formattedFeedback;
  } catch (error) {
    console.error('Error formatting feedback:', error);
    return 'Error processing feedback';
  }
};

const countWords = (text) => {
  try {
    const words = text.trim().split(/\s+/).filter(Boolean);
    console.log('Counted words:', words.length); // Debug log
    return words.length;
  } catch (error) {
    console.error('Error counting words:', error);
    return 0;
  }
};

const evaluateEssayWithRetry = async (exam_id, essay_text, retries = 3) => {
  try {
    return await evaluateEssay(exam_id, essay_text);
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying essay evaluation... Attempts left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 sec before retry
      return await evaluateEssayWithRetry(exam_id, essay_text, retries - 1);
    } else {
      console.error('All retries failed:', error.message);
      throw error;
    }
  }
};


export default evaluateEssayWithRetry;
