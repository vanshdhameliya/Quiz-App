import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="window-dots">
          <span></span><span></span><span></span>
        </span>
        QuizMaster
      </Link>
      <nav className="navbar-links">
        <NavLink to="/quizzes" className={({ isActive }) => (isActive ? 'active' : '')}>
          quizzes
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
          admin
        </NavLink>
        {isAuthenticated && (
          <button className="navbar-logout" onClick={handleLogout}>logout</button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
