import React, { useState } from 'react';
import { Container, Dropdown, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faSignOutAlt, faBook, faNewspaper, faList, faClipboardList, faEnvelope, faSignInAlt, faRankingStar } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { logOut } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';
import SignupModal from '../home/SignupModal';
import LoginModal from '../home/LoginModal';

function TopMenu() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await logOut();
      if (result.success) {
        navigate('/'); // Navigate to home page after logout
      } else {
        console.error('Error logging out:', result.error);
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
    }
  };

  const handleSignupClick = () => {
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  return (
    <div className="top-menu">
      <Container>
        <div className="top-menu-content">
          <div className="top-menu-title">
            <FontAwesomeIcon icon={faBook} />
            <span className="d-none d-sm-inline"> </span>Altoword
          </div>
          <div className="top-menu-actions">
            <a href="#" className="top-menu-link" onClick={() => navigate('/main')}>
              <FontAwesomeIcon icon={faNewspaper} className="me-1" />
              <span className="d-none d-sm-inline">Articles</span>
            </a>
            <a href="#" className="top-menu-link" onClick={() => navigate('/mywords')}>
              <FontAwesomeIcon icon={faList} className="me-1" />
              <span className="d-none d-sm-inline">My Words</span>
            </a>

            <a href="#" className="top-menu-link" onClick={() => navigate('/tests')}>
              <FontAwesomeIcon icon={faClipboardList} className="me-1" />
              <span className="d-none d-sm-inline">Tests</span>
            </a>
            <a href="#" className="top-menu-link" onClick={() => navigate('/rank')}>
              <FontAwesomeIcon icon={faRankingStar} className="me-1" />
              <span className="d-none d-sm-inline">Rank</span>
            </a>
            {currentUser ? (
              <Dropdown align="end" className="top-menu-user-dropdown">

                <Dropdown.Toggle variant="link" id="profile-dropdown" className="top-menu-link no-caret">
                  <div className='user d-flex align-items-center'>
                    <span className="ms-2 mx-2 d-none d-sm-inline">Profile</span>
                    <div className="user-avatar">
                     {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>

                </Dropdown.Toggle>

                <Dropdown.Menu className="profile-dropdown-menu">
                  <div className="user-info px-3 py-3">
                    <div className="user-avatar-large mb-2">
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="user-name">{currentUser.displayName || 'User'}</div>
                    <div className="user-email">
                      <FontAwesomeIcon icon={faEnvelope} className="me-1" />
                      {currentUser.email}
                    </div>
                  </div>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Log Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button className="signup-btn" onClick={handleSignupClick}>
                <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                <span className="d-none d-sm-inline">Sign Up</span>
              </Button>
            )}
          </div>
        </div>
      </Container>

      {/* Auth Modals */}
      <SignupModal
        show={showSignupModal}
        onHide={() => setShowSignupModal(false)}
        switchToLogin={switchToLogin}
      />
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        switchToSignup={switchToSignup}
      />
    </div>
  );
}

export default TopMenu; 