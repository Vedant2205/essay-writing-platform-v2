import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!location.state || !location.state.essay_id) {
      return navigate('/exam-selection');
    }

    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/results/${location.state.essay_id}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch results. Please try again later.');
        }

        const data = await response.json();

        if (data.success) {
          setResult(data.data);
        } else {
          throw new Error(data.message || 'Error fetching result data.');
        }
      } catch (error) {
        console.error('Error fetching result:', error);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
        <p className="ml-4">Loading...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{errorMessage}</p>
        <button
          onClick={() => navigate('/exam-selection')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  const score = result?.score ?? 'N/A';
  const wordCount = result?.word_count ?? 'N/A';
  const characterCount = result?.character_count ?? 'N/A';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <h1 className="text-xl font-bold">EssayPrep</h1>
      </header>

      <main className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section>
            <h2 className="text-2xl font-bold mb-4">Essay Evaluation Result</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border rounded shadow-sm bg-white">
                <h3 className="font-semibold text-gray-700">Score</h3>
                <p className="text-2xl font-bold mt-2">{score}</p>
              </div>
              <div className="p-4 border rounded shadow-sm bg-white">
                <h3 className="font-semibold text-gray-700">Word Count</h3>
                <p className="text-2xl font-bold mt-2">{wordCount}</p>
              </div>
              <div className="p-4 border rounded shadow-sm bg-white">
                <h3 className="font-semibold text-gray-700">Character Count</h3>
                <p className="text-2xl font-bold mt-2">{characterCount}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Feedback</h3>
              <div className="bg-white p-4 rounded border prose max-w-none">
                {result.feedback ? (
                  result.feedback.split('\n').map((line, index) => (
                    <p key={index} className="mb-2 text-gray-700">
                      {line}
                    </p>
                  ))
                ) : (
                  <p>No feedback available</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Your Essay</h3>
              <div className="bg-white p-4 rounded border">
                <p className="whitespace-pre-wrap">{location.state.essay}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => navigate('/exam-selection')}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Take Another Test
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Print Result
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;
