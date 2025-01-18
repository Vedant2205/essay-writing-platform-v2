/* eslint-disable no-unused-vars */

import React from 'react';

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-green-600 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <h1 className="text-3xl font-bold text-white">EssayPrep</h1>
          <nav className="flex items-center space-x-6">
            <a href="/mock-test" className="text-red hover:text-gray-200">
              Mock Test
            </a>
            <a href="/contact" className="text-white hover:text-gray-200">
              Contact
            </a>
            <a href="/progress" className="text-white hover:text-gray-200">
              Progress
            </a>
            <a
              href="/signin"
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400 transition"
            >
              Sign In
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative bg-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Hero Text */}
              <div className="w-full md:w-1/2 pr-0 md:pr-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Write your best essay with EssayPrep
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Get detailed feedback on your writing in 24 hours
                </p>
                <div className="mt-8">
                  <a
                    href="/exams"
                    className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 transition"
                  >
                    View all exams
                  </a>
                </div>
              </div>

              {/* Hero Image */}
              <div className="w-full md:w-1/2 mt-8 md:mt-0">
                <img
                  src="/api/placeholder/600/400"
                  alt="Writing desk with notebook and coffee"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Popular Exams Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-2xl font-bold text-gray-900">Popular exams</h3>
            <p className="mt-2 text-gray-600">
              We offer feedback on all types of essays, including academic, general, and professional.
              Choose your exam to get started.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {[
                {
                  exam: 'IELTS',
                  description: 'Get feedback on your essays from the experts'
                },
                {
                  exam: 'TOEFL',
                  description: 'Help improve writing skills and prepare for exams'
                },
                {
                  exam: 'GRE',
                  description: 'Expert guidance for analytical writing'
                },
                {
                  exam: 'GMAT',
                  description: 'Comprehensive feedback for essay section'
                },
                {
                  exam: 'SAT',
                  description: 'Improve your writing score with expert help'
                }
              ].map((item) => (
                <div
                  key={item.exam}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h4 className="text-xl font-bold text-gray-900">{item.exam}</h4>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-2xl font-bold text-gray-900">How it works</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-8">
              {[
                { step: 'Choose an exam', icon: '🎯' },
                { step: 'Write your essay', icon: '✍️' },
                { step: 'We review your essay', icon: '📝' },
                { step: 'Get detailed feedback', icon: '📊' },
                { step: 'Pay securely', icon: '🔒' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <span className="text-4xl mb-4">{item.icon}</span>
                  <p className="font-medium text-gray-900">{item.step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-600 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white">© 2024 EssayPrep. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;