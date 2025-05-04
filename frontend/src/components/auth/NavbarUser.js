import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faEnvelope, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { logOut } from '../../firebase/auth';

function NavbarUser() {
  const { currentUser, isEmailVerified } = useAuth();

  const handleLogout = async () => {
    try {
      const result = await logOut();
      if (!result.success) {
        console.error('Error logging out:', result.error);
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
    }
  };

  if (!currentUser) return null;

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="link" id="user-dropdown" className="nav-user-toggle">
        <div className="user-avatar">
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="User" className="user-photo" />
          ) : (
            <FontAwesomeIcon icon={faUser} />
          )}
          {!isEmailVerified && (
            <span className="verification-badge" title="Email not verified">
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </span>
          )}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu className="user-dropdown-menu">
        <div className="user-info px-3 py-2">
          <div className="user-name">{currentUser.displayName || 'User'}</div>
          <div className="user-email">
            <FontAwesomeIcon icon={faEnvelope} className="me-1" />
            {currentUser.email}
          </div>
          {!isEmailVerified && (
            <div className="verification-warning mt-2">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-1 text-warning" />
              <small className="text-warning">Email not verified</small>
            </div>
          )}
        </div>
        <Dropdown.Divider />
        <Dropdown.Item onClick={handleLogout} className="text-danger">
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
          Log Out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default NavbarUser; 