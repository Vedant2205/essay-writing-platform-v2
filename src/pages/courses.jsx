/* eslint-disable no-unused-vars */

import React from 'react';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold">EssayPrep</h1>
        <nav className="space-x-4">
          <Link to="/dashboard" className="text-gray-700">Dashboard</Link>
          <Link to="/exam-selection" className="text-gray-700">Mock Test</Link>
          <Link to="/scoreboard" className="text-gray-700">Progress</Link>
          <Link to="/contact" className="text-gray-700">Contact</Link>
        </nav>
      </header>

      <main className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold">Courses</h2>
          <p className="text-gray-600 mt-2">Explore our essay preparation guides and writing tips.</p>

          {/* Example of available courses */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {['Essay Writing 101', 'Advanced Essay Strategies', 'GRE Essay Preparation'].map((course, index) => (
              <div key={index} className="p-4 bg-white shadow rounded border">
                <h3 className="text-lg font-bold text-gray-700">{course}</h3>
                <p className="text-gray-600 mt-2">Learn key strategies and tips for excelling in essay writing for various exams.</p>
                <Link
                  to={`/course/${course.replace(/\s+/g, '-').toLowerCase()}`}
                  className="text-green-500 mt-4 inline-block"
                >
                  View Course Details
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button className="px-6 py-2 bg-green-500 text-white rounded">Video Lectures</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursesPage;
