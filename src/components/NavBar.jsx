// src/components/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between">
        <Link to="/" className="font-bold text-lg">Home</Link>
        <div className="space-x-6">
          <Link to="/exam-selection" className="hover:text-blue-400">Exams</Link>
          <Link to="/results" className="hover:text-blue-400">Results</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
