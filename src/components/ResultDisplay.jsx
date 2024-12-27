// src/components/ResultDisplay.jsx

import React from 'react';

const ResultDisplay = ({ evaluationResult }) => {
  if (!evaluationResult) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-500">No evaluation result available.</p>
      </div>
    );
  }

  const { totalScore, wordCount, characterCount, overallFeedback, criteriaScores } = evaluationResult;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-4xl px-4 py-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Essay Evaluation Result</h1>
        
        {/* Total Score */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Total Score: {totalScore}/10</h2>
          <p className="text-gray-600">Word Count: {wordCount}</p>
          <p className="text-gray-600">Character Count: {characterCount}</p>
        </div>

        {/* Overall Feedback */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Overall Feedback</h3>
          <p className="text-gray-600">{overallFeedback}</p>
        </div>

        {/* Criteria Scores */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Criteria Scores</h3>
          <div className="space-y-4">
            {criteriaScores.map((criteria, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-medium">{criteria.name}</h4>
                <p className="text-gray-600">Score: {criteria.score}/5</p>
                <p className="text-gray-500">Feedback: {criteria.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
