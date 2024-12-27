// src/pages/EssayForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // For making HTTP requests

const EssayForm = () => {
  const [essayText, setEssayText] = useState('');
  const [exam, setExam] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send POST request to backend to evaluate essay
      const response = await axios.post('http://localhost:5000/api/essays/evaluate', {
        exam,
        essayText,
      });

      // Handle successful response
      setEvaluationResult(response.data);
      setIsSubmitting(false);
      navigate('/resultpage', { state: { result: response.data } }); // Navigate to the result page
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error in essay submission:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Essay Submission</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exam Selection */}
          <div>
            <label htmlFor="exam" className="block text-lg font-medium text-gray-700">Select Exam</label>
            <select
              id="exam"
              name="exam"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select an exam</option>
              <option value="IELTS">IELTS</option>
              <option value="TOEFL">TOEFL</option>
              {/* Add more exams if necessary */}
            </select>
          </div>

          {/* Essay Text Input */}
          <div>
            <label htmlFor="essayText" className="block text-lg font-medium text-gray-700">Write Your Essay</label>
            <textarea
              id="essayText"
              name="essayText"
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              rows="10"
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Write your essay here"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EssayForm;
