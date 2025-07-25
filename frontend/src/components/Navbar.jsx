import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, admin, onSignOut }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-700">
        <Link to="/">SECE Portal</Link>
      </div>

      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
            >
              Dashboard
            </Link>

            {/* 👇 Conditional Links Based on Role */}
            {role === 'admin' ? (
              <Link
                to="/create-announcement"
                className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
              >
                Add Announcement
              </Link>
            ) : role === 'student' ? (
              <Link
                to="/coding-room"
                className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
              >
                Live Code
              </Link>
            ) : null}

            <Link
              to="/lost-found"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
            >
              Lost & Found
            </Link>

            <button
              onClick={onSignOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm transition duration-200"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition duration-200"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
