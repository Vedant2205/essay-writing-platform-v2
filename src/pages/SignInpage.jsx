/* eslint-disable no-unused-vars */
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/config'; // Import the dynamic API URL

const SignInPage = () => {
  const navigate = useNavigate(); // React Router hook for navigation

  const handleLoginSuccess = (response) => {
    console.log('Login successful:', response);

    // Send the token to the backend for verification
    fetch(`${API_URL}/api/auth/google`, { // Use the dynamic API_URL here
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: response.credential }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.token) {
          // Store the token in localStorage
          localStorage.setItem('token', data.token);

          // Redirect to the dashboard using React Router
          navigate('/dashboard');
        } else {
          console.error('Authentication failed:', data.message);
          alert('Authentication failed. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again later.');
      });
  };

  const handleLoginFailure = (error) => {
    console.error('Login failed:', error);
    alert('Google login failed. Please try again.');
  };

  return (
    <div className="signin-container flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
          useOneTap
        />
      </div>
    </div>
  );
};

export default SignInPage;
