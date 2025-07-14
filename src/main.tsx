import React from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Try to get the publishable key from build-time environment
let PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Fallback: If not available at build time, use the hardcoded key for now
if (!PUBLISHABLE_KEY) {
  PUBLISHABLE_KEY = 'pk_test_Y3V0ZS10dXJ0bGUtMjYuY2xlcmsuYWNjb3VudHMuZGV2JA';
  console.warn('Using fallback Clerk key - environment variable not available at build time');
}

// Debug logging
console.log('Environment check:', {
  PUBLISHABLE_KEY: PUBLISHABLE_KEY ? 'Set' : 'Missing',
  SOURCE: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'Environment' : 'Fallback',
  NODE_ENV: import.meta.env.MODE,
  ALL_ENV: import.meta.env
});

if (!PUBLISHABLE_KEY) {
  // Show error on page instead of throwing
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: red;">Configuration Error</h1>
        <p>Missing Clerk Publishable Key</p>
        <p>Please set VITE_CLERK_PUBLISHABLE_KEY environment variable</p>
        <details>
          <summary>Debug Info</summary>
          <pre>${JSON.stringify(import.meta.env, null, 2)}</pre>
        </details>
      </div>
    `;
  }
} else {
  try {
    createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <App />
        </ClerkProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('App initialization error:', error);
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: red;">App Error</h1>
          <p>Failed to initialize application</p>
          <pre>${error}</pre>
        </div>
      `;
    }
  }
}
