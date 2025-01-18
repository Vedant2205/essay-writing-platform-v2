/* eslint-disable no-unused-vars */

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const SignIn = () => {
  const handleLoginSuccess = (response) => {
    // Handle the Google login success
    console.log('Login successful:', response);

    // Send the token to your backend for verification
    fetch('http://localhost:5000/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: response.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          // Assuming token is returned on successful authentication
          localStorage.setItem('token', data.token);
          // Redirect to dashboard or perform other actions on success
          window.location.href = '/dashboard';
        } else {
          console.error('Authentication failed:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
      });
  };

  const handleLoginFailure = (error) => {
    console.error('Login failed:', error);
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

export default SignIn;
