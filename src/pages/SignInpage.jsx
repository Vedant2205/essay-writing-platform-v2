import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    // You can add login logic here (e.g., API call for authentication)
    // For now, we're just redirecting to the dashboard after form submission
    navigate('/dashboard'); // Redirect to the dashboard page after successful sign-in
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow rounded w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Start your Essay Preparation</h1>

        {/* Sign in with Google */}
        <button className="w-full bg-green-500 text-white py-3 rounded mb-4">
          Sign in with Google
        </button>

        {/* Sign in with Facebook */}
        <button className="w-full bg-gray-300 text-gray-800 py-3 rounded mb-4">
          Sign in with Facebook
        </button>

        <p className="text-center text-gray-500 mb-4">or sign up with Email</p>

        {/* Sign-in form */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Handle email input
          />
          <input
            type="password"
            placeholder="Create a Password"
            className="w-full p-3 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Handle password input
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
