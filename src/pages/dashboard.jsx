import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold">EssayPrep</h1>
        <nav className="space-x-4">
          <Link to="/dashboard" className="text-gray-700">Home</Link>
          <Link to="/courses" className="text-gray-700">Courses</Link>
          <Link to="/exam-selection" className="text-gray-700">Mock Test</Link>
          <Link to="/progress" className="text-gray-700">Progress</Link>
          <Link to="/contact" className="text-gray-700">Contact</Link>
        </nav>
      </header>

      <main className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <section className="text-center">
            <h2 className="text-2xl font-bold">Write your best essay with EssayPrep</h2>
            <p className="text-gray-600 mt-2">Our detailed feedback will help you improve your writing in 24 hours.</p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-bold">Popular Exams</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {['IELTS', 'TOEFL', 'GRE', 'GMAT', 'SAT'].map((exam) => (
                <div key={exam} className="p-4 border rounded shadow-sm">
                  <h4 className="font-bold text-gray-700">{exam}</h4>
                  <p className="text-gray-500 text-sm">Get feedback on your essays from the experts.</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-bold">How it Works</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {['Choose an exam', 'Write your essay', 'We review your essay', 'Get detailed feedback'].map((step, index) => (
                <div key={index} className="p-4 border rounded shadow-sm text-center">
                  <p className="text-gray-700 font-medium">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
