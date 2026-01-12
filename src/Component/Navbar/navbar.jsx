import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../../LoginPage/firebase";
import Button from "../../components/ui/Button";

const Navbar = () => {
  const { user, logout } = useUser();
  const [showLogout, setShowLogout] = useState(false);
  const location = useLocation();

  const toggleLogout = () => {
    setShowLogout((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      setShowLogout(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Helper to generate consistent link styles
  const getLinkStyle = (path) => ({
    color: isActive(path) ? 'var(--color-primary)' : 'var(--color-text-secondary)',
    fontWeight: isActive(path) ? '600' : '500',
    fontSize: 'var(--font-size-sm)',
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius-md)',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    backgroundColor: isActive(path) ? 'var(--color-primary-light)' : 'transparent',
    textDecoration: 'none',
    position: 'relative'
  });

  return (
    <nav className="navbar-blur" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid var(--color-border)',
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" className="transition-smooth hover-scale" style={{ 
          fontSize: '1.5rem', 
          fontWeight: '800', 
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #6366f1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          letterSpacing: '-0.02em',
          textDecoration: 'none'
        }}>
          SmartBudget
        </Link>
        
        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link 
            to="/budget" 
            className="transition-smooth"
            style={getLinkStyle('/budget')}
            onMouseEnter={e => {
              if (!isActive('/budget')) {
                e.currentTarget.style.color = 'var(--color-text-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={e => {
              if (!isActive('/budget')) {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            Budget Planner
          </Link>
          <Link 
            to="/monthly-breakdown" 
            className="transition-smooth"
            style={getLinkStyle('/monthly-breakdown')}
            onMouseEnter={e => {
              if (!isActive('/monthly-breakdown')) {
                e.currentTarget.style.color = 'var(--color-text-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={e => {
              if (!isActive('/monthly-breakdown')) {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            Monthly Breakdown
          </Link>
          <Link 
            to="/blog" 
            className="transition-smooth"
            style={getLinkStyle('/blog')}
            onMouseEnter={e => {
              if (!isActive('/blog')) {
                e.currentTarget.style.color = 'var(--color-text-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={e => {
              if (!isActive('/blog')) {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            Blog
          </Link>
          
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 1rem' }}></div>

          {user ? (
            <div style={{ position: 'relative' }}>
              <div 
                 onClick={toggleLogout}
                 className="transition-smooth hover-scale"
                 style={{
                   display: 'flex',
                   alignItems: 'center',
                   gap: '0.75rem',
                   cursor: 'pointer',
                   padding: '0.25rem',
                   borderRadius: '99px',
                   border: '1px solid transparent'
                 }}
                 onMouseEnter={e => {
                   e.currentTarget.style.borderColor = 'var(--color-border)';
                   e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)';
                 }}
                 onMouseLeave={e => {
                   e.currentTarget.style.borderColor = 'transparent';
                   e.currentTarget.style.backgroundColor = 'transparent';
                 }}
              >
                  <img
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.name || 'User'}&backgroundColor=6366f1`}
                    alt="avatar"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: '2px solid white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, paddingRight: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                          {user.name && user.name !== '' ? user.name : 'My Account'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Profile</span>
                  </div>
              </div>

              {showLogout && (
                <div className="animate-scale-in" style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  padding: '1rem',
                  minWidth: '200px',
                  border: '1px solid var(--color-border)',
                  zIndex: 100
                }}>
                  <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>{user.name || 'User'}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                  </div>
                  <Button 
                    variant="danger" 
                    onClick={handleLogout} 
                    style={{ width: '100%', fontSize: '0.875rem', justifyContent: 'center' }}
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
