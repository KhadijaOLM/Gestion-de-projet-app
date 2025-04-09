
//frontend/src/components/layout/Header.js
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Layout.css';

const Header = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClickOutside = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/dashboard" className="logo">
            TaskFlow
          </Link>
          
          {isLoggedIn && (
            <nav className="main-nav">
              <Link to="/dashboard" className="nav-link">Tableau de bord</Link>
            </nav>
          )}
        </div>
        
        <div className="header-right">
          {isLoggedIn ? (
            <div className="user-menu" onClick={e => e.stopPropagation()}>
              <button className="user-button" onClick={toggleDropdown}>
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name">{user?.name || 'Utilisateur'}</span>
                <i className={`fa-solid fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
              </button>
              
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">Profil</Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-button" onClick={handleLogout}>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Connexion</Link>
              <Link to="/register" className="btn btn-primary">Inscription</Link>
            </div>
          )}
        </div>
      </div>
      
      {isDropdownOpen && (
        <div className="dropdown-backdrop" onClick={handleClickOutside}></div>
      )}
    </header>
  );
};
export default Header;
