import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';  // React Router DOM for navigation

const ResultPage = () => {
  const { essay_id } = useParams();  // URL param: /results/:essay_id
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geminiResult, setGeminiResult] = useState(null);  // Store the Gemini API result

  useEffect(() => {
    const fetchEssayResult = async () => {
      try {
        // First, fetch essay details from Gemini API
        const geminiResponse = await axios.get(`http://localhost:5000/api/gemini/${essay_id}`);  // Assuming Gemini API is available at this endpoint
        setGeminiResult(geminiResponse.data);

        // Fetch result by essay_id (this could be from your backend API that processes the essay)
        const response = await axios.get(`http://localhost:5000/api/results/essay/${essay_id}`);
        setResult(response.data);
      } catch (error) {
        console.error('Error fetching result or Gemini data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEssayResult();
  }, [essay_id]);

  if (loading) return <p>Loading...</p>;

  if (!result || !geminiResult) return <p>No result found.</p>;

  return (
    <div className="result-container">
      <h2>📝 Essay Evaluation</h2>

      <div className="section">
        <strong>📌 Question:</strong>
        <p>{result.question_text}</p>
      </div>

      <div className="section">
        <strong>🧾 Your Answer:</strong>
        <p>{result.essay_text}</p>
      </div>

      <div className="section">
        <strong>📊 Score (Gemini API):</strong>
        <p>{geminiResult.score}</p>
      </div>

      <div className="section">
        <strong>💬 Feedback (Gemini API):</strong>
        <p>{geminiResult.feedback}</p>
      </div>
    </div>
  );
};

export default ResultPage;
