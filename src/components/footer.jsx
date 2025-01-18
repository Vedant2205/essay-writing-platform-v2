// src/components/Footer.jsx
/* eslint-disable no-unused-vars */

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="max-w-7xl mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Essay Evaluation App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
