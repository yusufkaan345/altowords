import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { FaPencilAlt, FaRandom, FaQuestionCircle } from 'react-icons/fa';
import '../../assets/styles/testspage.css';

const TestSidebar = ({ activeTest, setActiveTest }) => {
  const testTypes = [
    {
      id: 'vocabulary',
      name: 'Vocabulary Flash Cards',
      description: 'Learn words with interactive flash cards',
      icon: <FaPencilAlt className="test-icon" />
    },
    {
      id: 'matching',
      name: 'Matching Game',
      description: 'Match words with their meanings',
      icon: <FaRandom className="test-icon" />
    },
    {
      id: 'multiplechoice',
      name: 'Multiple Choice Quiz',
      description: 'Test your vocabulary knowledge',
      icon: <FaQuestionCircle className="test-icon" />
    }
  ];

  return (
    <div className="test-sidebar">
      <h3>Test Types</h3>
      <ListGroup>
        {testTypes.map(test => (
          <ListGroup.Item
            key={test.id}
            active={activeTest === test.id}
            onClick={() => setActiveTest(test.id)}
          >
            {test.icon}
            <span className="test-name">{test.name}</span>
            <span className="test-description">{test.description}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default TestSidebar; 