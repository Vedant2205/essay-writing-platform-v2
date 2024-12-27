import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Scoreboard = () => {
  const [userStats, setUserStats] = useState({
    completions: 0,
    essayScore: 0,
    wordsWritten: 0,
    feedbacksReceived: 0,
  });

  const [essays, setEssays] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace `userId` with actual logic to get the user's ID
    const userId = '123'; // Example user ID

    // Fetch user stats and essays
    const fetchUserStats = async () => {
      try {
        const statsResponse = await axios.get(`http://localhost:5000/api/results/${userId}`);
        const essaysResponse = await axios.get(`http://localhost:5000/api/essays/${userId}`);

        // Assuming the response contains relevant data
        setUserStats({
          completions: statsResponse.data.completions,
          essayScore: statsResponse.data.essayScore,
          wordsWritten: statsResponse.data.wordsWritten,
          feedbacksReceived: statsResponse.data.feedbacksReceived,
        });
        setEssays(essaysResponse.data);  // Set the essays data
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Your Progress</h1>
          <nav className="space-x-4">
            <Link to="/dashboard" className="text-gray-700">Dashboard</Link>
            <Link to="/contact" className="text-gray-700">Contact</Link>
            <Link to="/signin" className="text-gray-700">Sign Out</Link>
          </nav>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white shadow rounded text-center">
          <h2 className="text-xl font-bold text-gray-800">{userStats.completions}</h2>
          <p className="text-sm text-gray-500">Completions</p>
        </div>
        <div className="p-4 bg-white shadow rounded text-center">
          <h2 className="text-xl font-bold text-gray-800">{userStats.essayScore}</h2>
          <p className="text-sm text-gray-500">Essay Score</p>
        </div>
        <div className="p-4 bg-white shadow rounded text-center">
          <h2 className="text-xl font-bold text-gray-800">{userStats.wordsWritten}</h2>
          <p className="text-sm text-gray-500">Words Written</p>
        </div>
        <div className="p-4 bg-white shadow rounded text-center">
          <h2 className="text-xl font-bold text-gray-800">{userStats.feedbacksReceived}</h2>
          <p className="text-sm text-gray-500">Feedbacks Received</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-800 mb-4">Your Essays</h2>
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="text-left px-4 py-2 border-b">Date</th>
              <th className="text-left px-4 py-2 border-b">Title</th>
              <th className="text-left px-4 py-2 border-b">Score</th>
              <th className="text-left px-4 py-2 border-b">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {essays.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-2 border-b">No essays found.</td>
              </tr>
            ) : (
              essays.map((essay) => (
                <tr key={essay.id}>
                  <td className="px-4 py-2 border-b">{new Date(essay.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border-b">{essay.title}</td>
                  <td className="px-4 py-2 border-b">{essay.score}</td>
                  <td className="px-4 py-2 border-b">
                    <Link to={`/feedback/${essay.id}`} className="text-blue-600">View Feedback</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Scoreboard;
