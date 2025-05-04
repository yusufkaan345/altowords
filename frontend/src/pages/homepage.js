import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/home/Navbar';
import HeroSection from '../components/home/HeroSection';
import VerificationAlert from '../components/auth/VerificationAlert';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/homepage.css';

function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, checkEmailVerification } = useAuth();
  const [verificationChecking, setVerificationChecking] = useState(false);

  // Check for signup modal open state from navigation
  useEffect(() => {
    if (location.state?.openSignupModal) {
      setShowSignupModal(true);
      
      // Clear the state to prevent showing the modal on page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Check for login alert from navigation state
  useEffect(() => {
    if (location.state?.showLoginAlert) {
      setNotification({
        type: 'warning',
        message: location.state.message || 'Please Sign Up or Log In to continue.'
      });
      
      // Clear the state to prevent showing the alert on page refresh
      window.history.replaceState({}, document.title);
      
      // Auto-hide notification after 5 seconds
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Redirect to main page if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, navigate]);

  // Set up a periodic check for email verification if user exists but not verified
  useEffect(() => {
    if (currentUser && !currentUser.emailVerified && !verificationChecking) {
      setVerificationChecking(true);
      
      const checkVerification = async () => {
        const isVerified = await checkEmailVerification();
        
        if (isVerified) {
          // If verified, redirect to main page
          navigate('/main');
        }
      };
      
      const interval = setInterval(checkVerification, 3000); // Check every 3 seconds
      
      return () => {
        clearInterval(interval);
        setVerificationChecking(false);
      };
    }
  }, [currentUser, navigate, checkEmailVerification, verificationChecking]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  const handleTryNow = () => {
    navigate('/main');
  };

  return (
    <div className="homepage" id="homepage">
      <Navbar 
        scrolled={scrolled} 
        initialShowSignup={showSignupModal}
        setShowSignupModal={setShowSignupModal}
      />
      
      {/* Show notification alert if there is one */}
      {notification && (
        <Container className="mt-5 pt-5">
          <Alert variant={notification.type} onClose={() => setNotification(null)} dismissible>
            {notification.message}
          </Alert>
        </Container>
      )}
      
      {/* Show verification alert only if user is logged in but email is not verified */}
      {currentUser && !currentUser.emailVerified && (
        <Container className="mt-5 pt-5">
          <VerificationAlert />
        </Container>
      )}
      
      <HeroSection onTryNow={handleTryNow} />

      {/* Our Story Section */}
      <section id="our-story" className="our-story-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <img 
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Our Story" 
                className="our-story-image"
              />
            </Col>
            <Col md={6}>
              <h2 className="our-story-title">Our Story</h2>
              <div className="our-story-content">
                <p>
                  Altoword was born from a simple idea: learning a language should be as natural as reading a book. 
                  Our founder, a language enthusiast and avid reader, noticed that traditional language learning methods 
                  often felt disconnected from real-world usage.
                </p>
                <p>
                  We believe that immersing yourself in authentic content is the key to mastering a language. 
                  By providing carefully selected books, articles, and interactive exercises, we create an environment 
                  where learning happens naturally through context and engagement.
                </p>
                <p>
                  Today, Altoword has helped thousands of learners worldwide improve their English skills while 
                  enjoying the process. Our mission is to make language learning accessible, enjoyable, and effective 
                  for everyone.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <Container>
          <h2 className="contact-title">Contact Us</h2>
          <div className="contact-form">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" className="form-control" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" className="form-control" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control type="text" placeholder="Enter subject" className="form-control" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control as="textarea" rows={4} placeholder="Enter your message" className="form-control" />
              </Form.Group>
              <Button className="submit-btn" type="submit">
                Send Message
              </Button>
            </Form>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer">
        <Container>
          <Row>
            <Col md={4}>
              <div className="footer-logo">
                <FontAwesomeIcon icon={faBook} />
                Altoword
              </div>
              <p>Master English through reading with our curated collection of books and interactive exercises.</p>
              <div className="social-icons">
                <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
                <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
              </div>
            </Col>
            <Col md={4}>
              <div className="footer-links">
                <h5>Quick Links</h5>
                <ul>
                  <li><a href="#homepage">Home</a></li>
                  <li><a href="#our-story">Our Story</a></li>
                  <li><a href="#comments">Comments</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
            </Col>
            <Col md={4}>
              <div className="footer-links">
                <h5>Contact Info</h5>
                <ul>
                  <li><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" /> 555 Bailey Ave, San Jose, CA 95141, USA</li>
                  <li><FontAwesomeIcon icon={faPhone} className="me-2" /> +1 234 567 890</li>
                  <li><FontAwesomeIcon icon={faEnvelope} className="me-2" /> info@kaandemirbas345@gmail.com</li>
                </ul>
              </div>
            </Col>
          </Row>
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} Altoword. All Rights Reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default HomePage;
