import React from 'react';
import { Alert } from 'react-bootstrap';
import { FaTools } from 'react-icons/fa';

const TestPlaceholder = ({ testType }) => {
  const testNames = {
    reading: 'Reading Comprehension',
    matching: 'Matching Exercises',
    multiplechoice: 'Multiple Choice',
  };

  const testName = testNames[testType] || 'Test';

  return (
    <div className="test-container">
      <div className="test-placeholder">
        <FaTools size={48} className="mb-3 text-muted" />
        <h3>Coming Soon</h3>
        <p className="mb-4">{testName} feature is currently under development. Please check back later!</p>
        <Alert variant="info">
          Try the Vocabulary Flash Cards test to practice your words in the meantime.
        </Alert>
      </div>
    </div>
  );
};

export default TestPlaceholder; 