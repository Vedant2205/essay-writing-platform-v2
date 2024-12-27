// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">Essay Evaluation App</Link>
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link to="/exam-selection" className="hover:underline">Exams</Link>
            </li>
            <li>
              <Link to="/results" className="hover:underline">Results</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
