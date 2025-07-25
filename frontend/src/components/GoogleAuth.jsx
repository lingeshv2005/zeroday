import React, { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase.js';
import '../styles/GoogleAuth.css';

const GoogleAuth = ({ onAuthSuccess, onAuthError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); // 'admin' or 'student'

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    hd: 'sece.ac.in',
    prompt: 'select_account',
  });

  const signInWithGoogle = async () => {
    if (!selectedRole) {
      onAuthError('Please select a role before signing in');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      if (!user.email.endsWith('@sece.ac.in')) {
        throw new Error('Only @sece.ac.in email addresses are allowed');
      }

      // Send token and role to backend
      const response = await fetch(`http://localhost:5000/${selectedRole}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      const sessionKey = selectedRole === 'admin' ? 'adminSession' : 'studentSession';
      localStorage.setItem(sessionKey, JSON.stringify({
        [selectedRole]: data[selectedRole],
        user: {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
        },
        token
      }));

      localStorage.setItem('role', selectedRole);
      onAuthSuccess(data[selectedRole], user);

    } catch (error) {
      console.error('GoogleAuth Error:', error);
      onAuthError(error.message || 'Sign-in error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    const studentSession = localStorage.getItem('studentSession');

    try {
      if (adminSession) {
        const { admin, user } = JSON.parse(adminSession);
        onAuthSuccess(admin, user);
      } else if (studentSession) {
        const { student, user } = JSON.parse(studentSession);
        onAuthSuccess(student, user);
      }
    } catch (err) {
      console.error('Session load error:', err);
      localStorage.removeItem('adminSession');
      localStorage.removeItem('studentSession');
    }
  }, []);

  return (
    <div className="google-auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>SECE Portal</h1>
          <p>Select your role to sign in</p>
        </div>

        <div className="auth-body space-y-4">
          <div className="flex gap-4 justify-center mb-4">
            <button
              onClick={() => setSelectedRole('admin')}
              className={`px-4 py-2 rounded ${selectedRole === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              Login as Admin
            </button>
            <button
              onClick={() => setSelectedRole('student')}
              className={`px-4 py-2 rounded ${selectedRole === 'student' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
            >
              Login as Student
            </button>
          </div>

          <button
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="google-signin-btn w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            {isLoading ? <div className="loading-spinner"></div> : 'Sign in with Google'}
          </button>

          {selectedRole && (
            <p className="text-sm text-center text-gray-600">
              You are signing in as <strong>{selectedRole}</strong>
            </p>
          )}

          <div className="auth-info text-xs text-gray-500 text-center mt-4">
            <p><strong>Note:</strong> Only @sece.ac.in emails are allowed.</p>
            <p>Example: <code>hod.2024it@sece.ac.in</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuth;
