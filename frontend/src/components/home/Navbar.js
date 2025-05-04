import React, { useState, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';
import NavbarUser from '../auth/NavbarUser';
import { useAuth } from '../../context/AuthContext';

function Navbar({ scrolled, initialShowSignup = false, setShowSignupModal }) {
  const { currentUser } = useAuth();
  const [localShowSignupModal, setLocalShowSignupModal] = useState(initialShowSignup);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setLocalShowSignupModal(initialShowSignup);
  }, [initialShowSignup]);

  // Update parent state when local state changes
  useEffect(() => {
    if (setShowSignupModal) {
      setShowSignupModal(localShowSignupModal);
    }
  }, [localShowSignupModal, setShowSignupModal]);

  const handleSignupClick = () => {
    setLocalShowSignupModal(true);
  };

  const switchToLogin = () => {
    setLocalShowSignupModal(false);
    setShowLoginModal(true);
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setLocalShowSignupModal(true);
  };

  return (
    <>
      <BootstrapNavbar 
        expand="lg" 
        fixed="top" 
        className={`navbar-custom ${scrolled ? 'scrolled' : ''}`}
      >
        <Container>
          <BootstrapNavbar.Brand href="#homepage" className="brand-logo">
            <FontAwesomeIcon icon={faBook} />
            <span> </span>Altoword
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#homepage" className="nav-link">Home</Nav.Link>
              <Nav.Link href="#our-story" className="nav-link">Our Story</Nav.Link>
              <Nav.Link href="#comments" className="nav-link">Comments</Nav.Link>
              <Nav.Link href="#contact" className="nav-link">Contact</Nav.Link>
              
              {currentUser ? (
                <NavbarUser />
              ) : (
                <Button className="signup-btn" onClick={handleSignupClick}>
                  <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                  Sign Up
                </Button>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      {/* Auth Modals */}
      <SignupModal
        show={localShowSignupModal}
        onHide={() => setLocalShowSignupModal(false)}
        switchToLogin={switchToLogin}
      />
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        switchToSignup={switchToSignup}
      />
    </>
  );
}

export default Navbar; 