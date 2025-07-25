import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import UpdateAdminProfile from './UpdateAdminProfile';

const AdminDashboard = ({ auth, user, admin, onSignOut }) => {
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(admin);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      onSignOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleUpdateSuccess = (updatedAdmin) => {
    setCurrentAdmin(updatedAdmin);
    setUpdatingProfile(false);
  };

  const formatLastLogin = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  if (updatingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">Update Profile</h1>
            <button
              onClick={() => setUpdatingProfile(false)}
              className="text-blue-600 hover:underline"
            >
              ← Back
            </button>
          </div>
          <UpdateAdminProfile onUpdateSuccess={handleUpdateSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
          <div className="space-x-2">
            <button
              onClick={() => setUpdatingProfile(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4">
            {currentAdmin?.photoURL ? (
              <img
                src={currentAdmin.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-4xl font-bold text-white bg-blue-500">
                {currentAdmin?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Welcome, {currentAdmin?.name || 'Admin'}!
          </h2>

          <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <DetailRow label="Name" value={currentAdmin?.name || 'N/A'} />
            <DetailRow label="Email" value={currentAdmin?.email || user?.email || 'N/A'} />
            <DetailRow label="Role" value={currentAdmin?.role || '-'} />
            <DetailRow label="Department" value={currentAdmin?.department || '-'} />
            <DetailRow label="Admin ID" value={currentAdmin?.uid || user?.uid || '-'} />
            <DetailRow label="Last Login" value={formatLastLogin(currentAdmin?.lastLogin)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="bg-gray-50 p-3 rounded border border-gray-200 shadow-sm">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="font-medium">{value}</div>
  </div>
);

export default AdminDashboard;
