import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // or useRouter if using Next.js

const ResultPage = () => {
  const { essay_id } = useParams(); // URL param: /results/:essay_id
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/results/${essay_id}`);
        setResult(response.data);
      } catch (error) {
        console.error("Error fetching result:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [essay_id]);

  if (loading) return <p>Loading...</p>;

  if (!result) return <p>No result found.</p>;

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
        <strong>📊 Score:</strong>
        <p>{result.score}</p>
      </div>

      <div className="section">
        <strong>💬 Feedback:</strong>
        <p>{result.feedback}</p>
      </div>
    </div>
  );
};

export default ResultPage;
