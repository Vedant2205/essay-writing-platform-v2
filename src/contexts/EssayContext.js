// src/contexts/EssayContext.js
/* eslint-disable no-unused-vars */

import React, { createContext, useState, useContext } from 'react';

// Create a Context for managing essay state
const EssayContext = createContext();

// Custom hook to use the EssayContext
export const useEssayContext = () => {
  return useContext(EssayContext);
};

// EssayContextProvider component that wraps your app or components that need access to essay state
export const EssayContextProvider = ({ children }) => {
  const [essayText, setEssayText] = useState('');  // Store essay text
  const [evaluationResult, setEvaluationResult] = useState(null);  // Store evaluation result

  // Function to update the essay text
  const updateEssayText = (text) => {
    setEssayText(text);
  };

  // Function to update the evaluation result
  const updateEvaluationResult = (result) => {
    setEvaluationResult(result);
  };

  return (
    <EssayContext.Provider value={{ essayText, updateEssayText, evaluationResult, updateEvaluationResult }}>
      {children}
    </EssayContext.Provider>
  );
};
