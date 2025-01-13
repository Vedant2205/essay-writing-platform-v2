import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/welcome';
import DashboardPage from './pages/dashboard';
import SignInPage from './pages/SignInpage';
import ExamSelectionPage from './pages/exam-selection';
import TestPage from './pages/testpage';
import ResultPage from './pages/resultpage';
import ScoreboardPage from './pages/scoreboard';
import CoursesPage from './pages/courses';
import ContactPage from './pages/contact';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/exam-selection" element={<ExamSelectionPage />} />
          <Route path="/testpage" element={<TestPage />} />
          <Route path="/resultpage" element={<ResultPage />} />
          <Route path="/scoreboard" element={<ScoreboardPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
