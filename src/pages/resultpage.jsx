import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.reviewData; // Assuming reviewData is passed from TestPage

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No test results available</h2>
          <button 
            onClick={() => navigate('/exam-selection')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Take a New Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold">EssayPrep</h1>
        <nav className="space-x-4">
          <Link to="/dashboard" className="text-gray-700">Home</Link>
          <Link to="/courses" className="text-gray-700">Courses</Link>
        </nav>
      </header>

      <main className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section>
            <h2 className="text-2xl font-bold mb-4">Essay Evaluation Result</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border rounded shadow-sm">
                <h3>Total Score</h3>
                <p>{result.totalScore || 'Score unavailable'}</p>
              </div>
              <div className="p-4 border rounded shadow-sm">
                <h3>Word Count</h3>
                <p>{result.wordCount || 'Word count not available'}</p>
              </div>
              <div className="p-4 border rounded shadow-sm">
                <h3>Character Count</h3>
                <p>{result.characterCount || 'Character count not available'}</p>
              </div>
            </div>

            <h3>Overall Feedback</h3>
            <p>{result.overallFeedback || 'No feedback available'}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.criteriaScores?.map((criteria, index) => (
                <div key={index} className="p-4 border rounded shadow-sm">
                  <h4>{criteria.name}</h4>
                  <p>{criteria.score}</p>
                  {criteria.feedback && <p>{criteria.feedback}</p>}
                </div>
              ))}
            </div>

            <h3>Essay Question</h3>
            <p>{result.questionText}</p>

            <div className="mt-6 flex justify-between">
              <button onClick={() => navigate('/exam-selection')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Take Another Test
              </button>
              <button onClick={() => window.print()} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
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
