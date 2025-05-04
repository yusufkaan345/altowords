import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { sendEmailVerification } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';

function VerificationAlert() {
  const { currentUser } = useAuth();
  
  const resendVerificationEmail = async () => {
    try {
      await sendEmailVerification(currentUser);
      alert('Verification email sent. Please check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      alert('Error sending verification email. Please try again later.');
    }
  };

  if (!currentUser || currentUser.emailVerified) {
    return null;
  }

  return (
    <Alert variant="warning" className="verification-alert">
      <Alert.Heading>Email Verification Required</Alert.Heading>
      <p>
        We've sent a verification email to <strong>{currentUser.email}</strong>. 
        Please check your inbox and verify your email address to access all features.
      </p>
      <div className="d-flex justify-content-end">
        <Button 
          variant="outline-warning" 
          onClick={resendVerificationEmail}
        >
          Resend Verification Email
        </Button>
      </div>
    </Alert>
  );
}

export default VerificationAlert; 