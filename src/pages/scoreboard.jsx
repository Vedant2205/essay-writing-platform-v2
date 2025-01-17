// src/pages/exam-selection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExamSelectionPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const exams = [
    { name: 'IELTS', id: 1 },
    { name: 'TOEFL', id: 2 },
    { name: 'GRE', id: 3 },
    { name: 'GMAT', id: 4 },
    { name: 'SAT', id: 5 },
    { name: 'ACT', id: 6 },
  ];

  const filteredExams = exams.filter((exam) =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExamSelection = (exam) => {
    navigate('/testpage', { state: { selectedExam: exam.id } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold">EssayPrep</h1>
      </header>

      <main className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Select an Exam</h2>
          <input
            type="text"
            placeholder="Search for Exams"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {filteredExams.map((exam) => (
              <button
                key={exam.id}
                onClick={() => handleExamSelection(exam)}
                className="p-4 bg-white border rounded shadow-sm text-center hover:bg-gray-100 transition"
              >
                <h4 className="font-bold text-gray-700">{exam.name}</h4>
                <p className="text-sm text-gray-500">Select for exam preparation</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamSelectionPage;