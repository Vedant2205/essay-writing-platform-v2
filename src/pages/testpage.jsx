import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TestPage = () => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [essay, setEssay] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedExam } = location.state || {};

  // Use environment variable for API URL with fallback
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://essay-writing-platform-v2.onrender.com';

  // Update word count when essay changes
  useEffect(() => {
    const words = essay.trim().split(/\s+/);
    setWordCount(essay.trim() ? words.length : 0);
  }, [essay]);

  // Redirect if no exam is selected
  useEffect(() => {
    if (!selectedExam) {
      console.warn('No exam selected, redirecting to exam selection');
      navigate('/exam-selection', { replace: true });
      return;
    }
  }, [selectedExam, navigate]);

  // Fetch question when exam is selected
  useEffect(() => {
    if (!selectedExam) return;

    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        // Correctly formatted endpoint URL
        const endpoint = `${API_BASE_URL}/questions?exam_id=${selectedExam}`;
        console.log('Fetching question for exam:', selectedExam);
        console.log('Endpoint:', endpoint);

        const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          let errorMessage;

          try {
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              errorMessage = errorData.message;
            } else {
              const textError = await response.text();
              errorMessage = `Server error: ${response.status}. ${textError}`;
            }
          } catch (e) {
            errorMessage = `Failed to parse error response: ${e.message}`;
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Received data:', data); // Add logging

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch question');
        }

        if (!data.question) {
          throw new Error('No question found in the response');
        }

        setQuestion(data.question);
        setErrorMessage('');
      } catch (error) {
        console.error('Detailed error fetching question:', error);
        setErrorMessage(
          `Failed to load question: ${error.message}. Please check your connection or try again.`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [selectedExam, API_BASE_URL]);

  const handleSubmit = async () => {
    if (!essay.trim()) {
      setErrorMessage('Essay cannot be empty.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/essays`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exam_id: selectedExam,
          essay_text: essay,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit essay. Please try again.');
      }

      const result = await response.json();
      console.log('Submission successful:', result);
      navigate('/results', { state: { result } });
    } catch (error) {
      console.error('Error submitting essay:', error);
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedExam) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Essay Question
            </h3>
            {question ? (
              <p className="text-gray-700 whitespace-pre-wrap">
                {question?.question_text}
              </p>
            ) : (
              <p className="text-red-600">
                Question could not be loaded. Please refresh the page or contact support.
              </p>
            )}
          </div>
          <div className="p-6">
            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Write your essay here..."
              className="w-full h-64 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Word count: {wordCount} {wordCount > 1000 && "(exceeded limit)"}
              </span>
              <button
                onClick={handleSubmit}
                disabled={submitting || wordCount > 1000}
                className={`px-4 py-2 rounded-lg text-white ${
                  submitting || wordCount > 1000
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit Essay'}
              </button>
            </div>
            {errorMessage && (
              <p className="mt-4 text-red-600">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;