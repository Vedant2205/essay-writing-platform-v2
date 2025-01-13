import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Your Google OAuth Client ID (replace this with your actual client ID)
const clientId = '1028499089698-u5n4dagaea30b6omvku69q5mehqv6poh.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrapping your App with GoogleOAuthProvider */}
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
