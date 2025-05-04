import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import HeroCarousel from './HeroCarousel';

function HeroSection({ onTryNow }) {
  return (
    <div className="hero-section">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <div className="hero-content">
              <h1 className="hero-title">MASTER ENGLISH THROUGH READING</h1>
              <p className="hero-subtitle">Improve your language skills with our curated collection of books and interactive exercises</p>
              <Button className="try-now-btn" onClick={onTryNow}>Try Now</Button>
            </div>
          </Col>
          <Col md={6}>
            <HeroCarousel />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HeroSection; 