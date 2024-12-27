import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ExamCard from '../components/Examcard';
import EssayForm from '../components/EssayForm';
import NavBar from '../components/NavBar';
import Footer from '../components/footer';

const TestPage = () => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [essay, setEssay] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedExam } = location.state || {}; // Fetch selectedExam data from location state

  useEffect(() => {
    if (!selectedExam) {
      toast.error("No exam selected. Please select an exam first.");
      navigate('/exam-selection');
      return;
    }

    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/exam/${selectedExam}`); // Adjusted endpoint
        if (!response.ok) throw new Error(`Error ${response.status}: Failed to fetch question`);
        const data = await response.json();
        setQuestion(data.question); // Adjusted data structure
      } catch (error) {
        console.error('Error fetching question:', error);
        toast.error("Failed to load question. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [selectedExam, navigate]);

  const handleSubmit = async () => {
    if (!essay.trim()) {
      toast.error("Please write your essay before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/essays/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examId: selectedExam,
          questionText: question,
          essayText: essay,
          userId: '123', // Replace with actual user ID
        }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}: Failed to submit essay`);
      const result = await response.json();
      navigate('/results', {
        state: {
          question,
          essay,
          reviewData: result,
        },
      });
    } catch (error) {
      console.error('Error submitting essay:', error);
      toast.error("Failed to submit essay. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading question...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <NavBar />
      <ExamCard>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Question:</h3>
            <p className="text-gray-700">{question}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Essay:</h3>
            <EssayForm
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Write your essay here..."
              className="min-h-[300px]"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-blue-500 text-white rounded w-full"
          >
            {submitting ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </ExamCard>
      <Footer />
    </div>
  );
};

export default TestPage;
