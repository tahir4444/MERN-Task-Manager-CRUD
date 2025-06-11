import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = user?.role?.name === 'admin' || user?.role?.name === 'superadmin';
  const roleName = typeof user?.role === 'object' ? user.role.name : user?.role;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Task Manager</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/todos">Todos</Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown" ref={dropdownRef}>
                <button
                  className="nav-link dropdown-toggle d-flex align-items-center gap-2 btn btn-link text-white"
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ 
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div className="d-flex flex-column align-items-end">
                    <span className="fw-bold" style={{ fontSize: '0.9rem' }}>{user.name || user.email}</span>
                    <small className="text-white-50" style={{ fontSize: '0.75rem' }}>{roleName}</small>
                  </div>
                  <div 
                    className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '32px', 
                      height: '32px',
                      color: '#0d6efd',
                      overflow: 'hidden'
                    }}
                  >
                    {user.profile_pic ? (
                      <img 
                        src={user.profile_pic} 
                        alt="Profile" 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <i className="bi bi-person-fill"></i>
                    )}
                  </div>
                </button>
                <div 
                  className={`dropdown-menu ${showDropdown ? 'show' : ''}`} 
                  style={{ 
                    right: 0, 
                    left: 'auto',
                    minWidth: '220px',
                    padding: '0.75rem',
                    marginTop: '0.5rem',
                    border: 'none',
                    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
                    borderRadius: '0.75rem',
                    backgroundColor: '#fff',
                    opacity: showDropdown ? 1 : 0,
                    transform: showDropdown ? 'translateY(0)' : 'translateY(-10px)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <div className="px-3 py-2 mb-2 border-bottom">
                    <div className="fw-bold text-primary" style={{ fontSize: '0.9rem' }}>Account</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{user.email}</div>
                  </div>
                  {isAdmin && (
                    <>
                      <Link 
                        className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 rounded" 
                        to="/users" 
                        onClick={() => setShowDropdown(false)}
                        style={{ 
                          transition: 'all 0.2s',
                          color: '#495057',
                          fontSize: '0.9rem'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          e.currentTarget.style.color = '#0d6efd';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#495057';
                        }}
                      >
                        <i className="bi bi-people-fill" style={{ fontSize: '1rem' }}></i>
                        User Management
                      </Link>
                      <Link 
                        className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 rounded" 
                        to="/roles" 
                        onClick={() => setShowDropdown(false)}
                        style={{ 
                          transition: 'all 0.2s',
                          color: '#495057',
                          fontSize: '0.9rem'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          e.currentTarget.style.color = '#0d6efd';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#495057';
                        }}
                      >
                        <i className="bi bi-shield-lock-fill" style={{ fontSize: '1rem' }}></i>
                        Roles Management
                      </Link>
                      <div className="dropdown-divider my-2"></div>
                    </>
                  )}
                  <button
                    className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 rounded" 
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    style={{ 
                      transition: 'all 0.2s',
                      color: '#dc3545',
                      fontSize: '0.9rem',
                      border: 'none',
                      background: 'transparent',
                      width: '100%',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#fff5f5';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <i className="bi bi-box-arrow-right" style={{ fontSize: '1rem' }}></i>
                    Logout
                  </button>
                </div>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 