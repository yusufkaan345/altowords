import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { loginWithEmailAndPassword, signInWithGoogle, resetPassword } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';

function LoginModal({ show, onHide, switchToSignup }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const result = await loginWithEmailAndPassword(email, password);
      
      if (result.success) {
        onHide(); // Close modal
        navigate('/main'); // Navigate to main page
      } else {
        // Check if the error is about email verification
        if (result.error.includes('not verified')) {
          setMessage(result.error);
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        onHide(); // Close modal
        navigate('/main'); // Navigate to main page
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An error occurred with Google sign-in. Please try again.');
      console.error(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset your password.');
      return;
    }
    
    setResetLoading(true);
    setError('');
    setMessage('');
    
    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setMessage('Password reset email sent. Please check your inbox.');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to send password reset email. Please try again later.');
      console.error(error);
    } finally {
      setResetLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError('');
    setMessage('');
    setLoading(false);
    setGoogleLoading(false);
    setResetLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      centered
      className="auth-modal"
    >
      <Modal.Header className="border-0">
        <Button 
          variant="link" 
          className="close-button"
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
        <Modal.Title className="w-100 text-center">Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="info">{message}</Alert>}
        
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="d-flex justify-content-end mt-1">
              <Button 
                variant="link" 
                className="p-0 btn-sm text-muted"
                onClick={handleResetPassword}
                disabled={resetLoading}
              >
                {resetLoading ? 'Sending...' : 'Forgot password?'}
              </Button>
            </div>
          </Form.Group>
          
          <Button 
            className="w-100 mb-3" 
            variant="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
          
          <div className="separator my-3">
            <span>OR</span>
          </div>
          
          <Button 
            className="w-100 mb-3 google-btn" 
            variant="outline-dark"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Connecting...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faGoogle} className="me-2" />
                Log in with Google
              </>
            )}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center">
        <p>Don't have an account?</p>
        <Button 
          variant="link" 
          onClick={() => {
            resetForm();
            switchToSignup();
          }}
        >
          Sign Up
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginModal; 