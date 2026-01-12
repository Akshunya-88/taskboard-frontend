import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import './Layout.css';

const Layout = ({ children }) => {
  const { setToken, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('access');
    setToken(null);
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/tasks', label: 'Tasks', icon: <ListIcon /> },
    { path: '/categories', label: 'Categories', icon: <CategoryIcon /> },
  ];

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Background Glow */}
        <div className="sidebar-glow" />

        {/* Header */}
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <span>⚡</span>
            </div>
            <div className="brand-text">
              <h1>TaskBoard</h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="menu-label">Menu</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">
                  {item.icon}
                </span>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <PersonIcon fontSize="small" />
            </div>
            <div className="user-info">
              <p className="user-name">{user?.username || 'User Account'}</p>
              <p className="user-email">{user?.email || 'user@example.com'}</p>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-btn">
            <LogoutIcon fontSize="small" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-glow" />
        <div className="content-container animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
