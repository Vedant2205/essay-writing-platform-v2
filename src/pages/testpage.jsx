import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://essay-backend-ghgt.onrender.com/api';

const fetchWithRetry = async (url, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      if (response.status === 404 || response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

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
        
        const response = await fetchWithRetry(
          `${API_BASE_URL}/questions/random-question/${selectedExam}`,
          {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch question');
        }

        console.log('Question fetched successfully:', data);
        setQuestion(data.question);
      } catch (error) {
        console.error('Error fetching question:', error);
        setErrorMessage(error.message || 'Failed to load question. Please try again later.');
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

      const response = await fetchWithRetry(
        `${API_BASE_URL}/essays/submit`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log('Server response:', result);

      if (!result.success) {
        throw new Error(result.message || 'Failed to submit essay');
      }

      const essayId = result?.data?.essay?.evaluation?.essay_id;
      if (!essayId) {
        console.error('Unexpected server response structure:', JSON.stringify(result, null, 2));
        throw new Error('Could not find essay_id in server response');
      }

      console.log('Essay submitted successfully with essay_id:', essayId);

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{errorMessage}</p>
            </div>
          )}

          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Write your essay here..."
            className="w-full h-64 p-4 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={submitting}
          />
          <button
            onClick={handleSubmit}
            className={`w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors
              ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </span>
            ) : (
              'Submit Essay'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;