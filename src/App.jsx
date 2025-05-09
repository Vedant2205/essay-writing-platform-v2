import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import the provider
import WelcomePage from './pages/welcome';
import DashboardPage from './pages/dashboard';
import SignInPage from './pages/SignInpage';
import ExamSelectionPage from './pages/exam-selection';
import TestPage from './pages/testpage';
import ResultPage from './pages/ResultPage';
import ScoreboardPage from './pages/scoreboard';
import CoursesPage from './pages/courses';
import ContactPage from './pages/contact';

const App = () => {
  return (
    // Ensure the correct Google Client ID is used
    <GoogleOAuthProvider clientId="1028499089698-u5n4dagaea30b6omvku69q5mehqv6poh.apps.googleusercontent.com">
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/exam-selection" element={<ExamSelectionPage />} />
            <Route path="/testpage" element={<TestPage />} />
            {/* Update this route to use essay_id as a URL parameter */}
            <Route path="/results/:essay_id" element={<ResultPage />} />
            <Route path="/scoreboard" element={<ScoreboardPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
