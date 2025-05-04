import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { registerWithEmailAndPassword, signInWithGoogle } from '../../firebase/auth';
import '../../assets/styles/homepage.css';

function SignupModal({ show, onHide, switchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validateForm = () => {
    // Reset error
    setError('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await registerWithEmailAndPassword(email, password);
      
      if (result.success) {
        setSuccess('Account created successfully! Please check your email for verification.');
        // Close modal after 1 second
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        onHide(); // Close modal on success
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

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setLoading(false);
    setGoogleLoading(false);
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
        <Modal.Title className="w-100 text-center">Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSignup}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              We'll send a verification email to this address.
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Create a password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              Password must be at least 6 characters.
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Confirm your password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
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
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
          
          <div className="separator my-3">
            <span>OR</span>
          </div>
          
          <Button 
            className="w-100 mb-3 google-btn" 
            variant="otline-primary"
            onClick={handleGoogleSignup}
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
                Sign up with Google
              </>
            )}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center">
        <p>Already have an account?</p>
        <Button 
          variant="link" 
          onClick={() => {
            resetForm();
            switchToLogin();
          }}
        >
          Log In
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SignupModal; 