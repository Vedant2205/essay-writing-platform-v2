import axios from 'axios';

export async function evaluateEssay(exam, essayText) {
  try {
    const response = await axios.post('http://localhost:5000/api/essays/evaluate', { exam, essayText });
    return response.data;
  } catch (error) {
    console.error('Error evaluating essay:', error);
    return {
      totalScore: 0,
      wordCount: essayText.trim().split(/\s+/).length,
      characterCount: essayText.length,
      overallFeedback: `Error in essay evaluation. Please try again. ${error.message}`,
      criteriaScores: [
        { name: "Ideas and Analysis", score: 0, feedback: "Unable to evaluate due to API error." },
        { name: "Writing Style", score: 0, feedback: "Unable to evaluate due to API error." },
        { name: "Overall Coherence", score: 0, feedback: "Unable to evaluate due to API error." },
      ]
    };
  }
}
