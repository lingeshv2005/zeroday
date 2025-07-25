import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';

import GoogleAuth from './components/GoogleAuth';
import AdminDashboard from './components/AdminDashboard';
import CreateAnnouncement from './components/CreateAnnouncement';
import Home from './components/Home';
import Navbar from './components/Navbar';
import LostFoundList from './components/LostFound';
import CodingRoomPage from './components/CodingRoomEditor';
import CodingRoomListPage from './components/CodingRoomListPage';

const App = () => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const res = await fetch(`http://localhost:5000/admin/${firebaseUser.uid}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (res.ok) {
            const data = await res.json();
            setAdmin(data.admin);
            setUser(firebaseUser);
          } else {
            setError('Unauthorized access');
            await signOut(auth);
          }
        } catch (err) {
          console.error(err);
          setError('Failed to load admin profile.');
        }
      } else {
        setUser(null);
        setAdmin(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (adminData, firebaseUser) => {
    setAdmin(adminData);
    setUser(firebaseUser);
    setError('');
  };

  const handleAuthError = (message) => {
    setError(message);
    setUser(null);
    setAdmin(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      setUser(null);
      setAdmin(null);
      setError('');
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      setError('Error signing out.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 flex justify-between items-center">
          <p>{error}</p>
          <button onClick={() => setError('')} className="font-bold px-2 text-xl">
            &times;
          </button>
        </div>
      )}

      <Navbar user={user} admin={admin} onSignOut={handleSignOut} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            user && admin ? (
              <Navigate to="/dashboard" />
            ) : (
              <GoogleAuth
                onAuthSuccess={handleAuthSuccess}
                onAuthError={handleAuthError}
              />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            user && admin ? (
              <AdminDashboard
                auth={auth}
                user={user}
                admin={admin}
                onSignOut={handleSignOut}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/create-announcement"
          element={
            user && admin ? <CreateAnnouncement /> : <Navigate to="/login" />
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/lost-found" element={<LostFoundList />} />
        <Route path="/coding-room/:roomId" element={<CodingRoomPage />} />
        <Route path="/coding-room" element={<CodingRoomListPage />} />

      </Routes>
    </div>
  );
};

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
