/* eslint-disable no-unused-vars */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ExamCard = ({ exam }) => {
  const navigate = useNavigate();

  // Handler for exam card click
  const handleExamClick = () => {
    if (exam && exam.id) {
      // Pass exam data (ID) to the TestPage via state
      navigate(`/testpage`, { state: { selectedExam: exam.id } });
    } else {
      console.error('Exam data is invalid or missing:', exam);
    }
  };

  if (!exam) {
    // Fallback UI if exam is not provided
    return <div className="text-red-500">Exam data is missing or invalid.</div>;
  }

  return (
    <div
      className="bg-white shadow-lg rounded-lg p-4 mb-4 cursor-pointer hover:shadow-xl transition"
      onClick={handleExamClick}
    >
      <div className="flex flex-col items-center">
        {/* Exam Title */}
        <h3 className="text-xl font-bold text-gray-700">{exam.name || 'Unnamed Exam'}</h3>
        {/* Exam Description */}
        <p className="text-sm text-gray-500 mt-2">{exam.description || 'No description available'}</p>
        {/* Exam Start Button */}
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Start Exam
        </button>
      </div>
    </div>
  );
};

// Prop validation
ExamCard.propTypes = {
  exam: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default ExamCard;
