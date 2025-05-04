import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../assets/styles/testspage.css';
import TopMenu from '../components/main/TopMenu';
import TestSidebar from '../components/tests/TestSidebar';
import VocabularyTest from '../components/tests/vocabulary/VocabularyTest';
import MatchingTest from '../components/tests/matching/MatchingTest';
import MultipleChoiceTest from '../components/tests/multiplechoice/MultipleChoiceTest';
import TestPlaceholder from '../components/tests/TestPlaceholder';

const TestsPage = () => {
  const [activeTest, setActiveTest] = useState('vocabulary');

  const renderTestContent = () => {
    if (!activeTest) {
      return (
        <div className="test-placeholder">
          <h3>Select a Test Type</h3>
          <p>Choose a test type from the sidebar to get started.</p>
        </div>
      );
    }

    switch (activeTest) {
      case 'vocabulary':
        return <VocabularyTest />;
      case 'matching':
        return <MatchingTest />;
      case 'multiplechoice':
        return <MultipleChoiceTest />;
     
      case 'grammar':
        return <TestPlaceholder testType={activeTest} />;
      default:
        return (
          <div className="test-placeholder">
            <h3>Unknown Test Type</h3>
            <p>The selected test type is not available.</p>
          </div>
        );
    }
  };

  return (
    <div className="tests-page">
      <Container fluid>
        <TopMenu />
        <Row className="mt-4">
          <Col md={3} className="sidebar-col">
            <TestSidebar activeTest={activeTest} setActiveTest={setActiveTest} />
          </Col>
          <Col md={9} className="test-content">
            {renderTestContent()}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TestsPage; 