/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TestPage = () => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [essay, setEssay] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedExam } = location.state || {};

  useEffect(() => {
    if (!selectedExam) {
      navigate('/exam-selection');
      return;
    }

    const fetchQuestion = async () => {
      try {
        console.log(`Fetching question for exam: ${selectedExam}`);
        setLoading(true);
        setErrorMessage('');
        const response = await fetch(
          `http://localhost:5000/api/questions/random-question/${selectedExam}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch question from the server.');
        }

        const data = await response.json();
        console.log('Question fetched successfully:', data);
        setQuestion(data.question);
      } catch (error) {
        console.error('Error fetching question:', error);
        setErrorMessage('Failed to load question. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [selectedExam, navigate]);

  const handleSubmit = async () => {
    if (submitting) return;

    if (!essay.trim()) {
      setErrorMessage('Essay cannot be empty.');
      return;
    }

    const wordCount = essay.trim().split(/\s+/).length;

    if (wordCount < 20) {
      setErrorMessage(`Essay must have at least 20 words. Current word count: ${wordCount}.`);
      return;
    }

    if (wordCount > 1000) {
      setErrorMessage(`Essay cannot exceed 1000 words. Current word count: ${wordCount}.`);
      return;
    }

    setErrorMessage('');
    setSubmitting(true);

    try {
      const payload = {
        exam_id: selectedExam,
        essayText: essay,
        userId: 1,
      };

      console.log('Submitting essay with payload:', payload);

      const response = await fetch('http://localhost:5000/api/essays/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit essay');
      }

      // Extract `essay_id` from the response structure
      const essayId = result?.data?.essay?.evaluation?.essay_id;
      if (!essayId) {
        console.error('Unexpected server response structure:', JSON.stringify(result, null, 2));
        throw new Error('Could not find essay_id in server response');
      }

      console.log('Essay submitted successfully with essay_id:', essayId);

      // Navigate to results page with necessary state
      navigate('/resultpage', {
        state: {
          essay_id: essayId,
          question: question?.question_text,
          essay: essay,
        },
        replace: true,
      });
    } catch (error) {
      console.error('Error submitting essay:', error);
      setErrorMessage(error.message || 'Failed to submit essay. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Question:</h3>
          <p className="text-gray-700 mb-6">
            {question?.question_text || 'No question available'}
          </p>
          {errorMessage && (
            <p className="text-red-500 mb-4">{errorMessage}</p>
          )}

          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Write your essay here..."
            className="w-full h-64 p-4 border rounded-lg mb-4"
            disabled={submitting}
          />
          <button
            onClick={handleSubmit}
            className={`w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Essay'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
