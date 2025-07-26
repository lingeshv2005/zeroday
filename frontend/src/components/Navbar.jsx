import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, admin, onSignOut }) => {
  const [role, setRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-card sticky top-0 z-50 px-6 py-4 mx-4 mt-4 rounded-2xl">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center animate-glow">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <Link to="/" className="text-2xl font-bold text-gradient hover:scale-105 transition-transform">
            SECE Portal
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {/* Always show Home */}
          <NavLink to="/" isActive={isActive('/')}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" isActive={isActive('/dashboard')}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
                Dashboard
              </NavLink>

              {role === 'admin' && (
                <NavLink to="/create-announcement" isActive={isActive('/create-announcement')}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  Create
                </NavLink>
              )}

              {role === 'student' && (
                <NavLink to="/coding-room" isActive={isActive('/coding-room')}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Code
                </NavLink>
              )}

              <NavLink to="/lost-found" isActive={isActive('/lost-found')}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Lost & Found
              </NavLink>

              <div className="h-6 w-px bg-gray-300 mx-3"></div>
              
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <span className="text-white text-sm font-medium">
                      {user?.displayName?.charAt(0)?.toUpperCase() || admin?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  
                  {/* User Info Tooltip */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{admin?.name || user?.displayName || 'User'}</p>
                      <p className="text-gray-500 text-xs">{user?.email}</p>
                      <p className="text-xs text-blue-600 mt-1 capitalize">{role || 'Member'}</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={onSignOut}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="btn-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </Link>
          )}
        </div>

        {/* Tablet Navigation - Simplified */}
        <div className="hidden md:flex lg:hidden items-center space-x-1">
          <NavLink to="/" isActive={isActive('/')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </NavLink>
          
          {user && (
            <>
              <NavLink to="/dashboard" isActive={isActive('/dashboard')}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </NavLink>
              
              <NavLink to="/lost-found" isActive={isActive('/lost-found')}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </NavLink>
              
              <div className="flex items-center space-x-2 ml-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            {/* Always show Home in mobile */}
            <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
              🏠 Home
            </MobileNavLink>
            
            {user ? (
              <>
                <MobileNavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  📊 Dashboard
                </MobileNavLink>
                
                {role === 'admin' && (
                  <MobileNavLink to="/create-announcement" onClick={() => setIsMenuOpen(false)}>
                    📢 Create Announcement
                  </MobileNavLink>
                )}
                
                {role === 'student' && (
                  <MobileNavLink to="/coding-room" onClick={() => setIsMenuOpen(false)}>
                    💻 Live Code
                  </MobileNavLink>
                )}
                
                <MobileNavLink to="/lost-found" onClick={() => setIsMenuOpen(false)}>
                  🔍 Lost & Found
                </MobileNavLink>
                
                {/* User Info in Mobile */}
                <div className="px-3 py-2 bg-blue-50 rounded-lg mt-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{admin?.name || user?.displayName || 'User'}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <p className="text-xs text-blue-600 capitalize">{role || 'Member'}</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    onSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <MobileNavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                🔑 Login
              </MobileNavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Helper component for navigation links
const NavLink = ({ to, children, isActive }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:-translate-y-0.5 ${
      isActive
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
        : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
    }`}
  >
    {children}
  </Link>
);

// Helper component for mobile navigation links
const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;
