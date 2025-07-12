import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLinkClick = (e) => {
    // Remove focus after clicking to prevent persistent outline
    e.target.blur();
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.navbar')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Ensure body padding when component mounts
  useEffect(() => {
    document.body.style.paddingTop = '90px';
    return () => {
      document.body.style.paddingTop = '0';
    };
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-text">Vescueye</span>
        </Link>

        <ul className={`navbar-links ${isMenuOpen ? 'navbar-links-open' : ''}`}>
          <li>
            <Link to="/" onClick={handleLinkClick} className="nav-link">
              <span>Home</span>
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link to={`/${user.role}-dashboard`} onClick={handleLinkClick} className="nav-link">
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="user-info">
                <span className="user-greeting">Welcome, {user.name || user.email}</span>
              </li>
              <li>
                <button 
                  className="logout-btn" 
                  onClick={handleLogout} 
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus on mouse click
                  aria-label="Logout"
                >
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signin" onClick={handleLinkClick} className="nav-link signin-link">
                  <span>Sign In</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/signup" 
                  onClick={handleLinkClick} 
                  className="signup-btn"
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus on mouse click
                >
                  <span>Sign Up</span>
                </Link>
              </li>
            </>
          )}
        </ul>

        <button
          className={`mobile-menu-btn ${isMenuOpen ? 'mobile-menu-btn-open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {isMenuOpen && <div className="mobile-menu-overlay" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navbar;