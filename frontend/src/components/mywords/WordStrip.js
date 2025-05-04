import React, { useState } from 'react';
import { Card, Button, Badge, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faTrash, faLanguage, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../../assets/styles/wordstrip.css';

/**
 * Displays a word strip with basic info and expandable details
 */
const WordStrip = ({ word, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  // Get first 3 translations for display
  const firstTranslations = word.translates.slice(0, 3).map(t => t.turkish).join(', ');
  
  return (
    <div className="word-strip">
      <div className="word-strip-main">
        <div className="word-strip-english">
          <h3>{word.word.toLowerCase()}</h3>
        </div>
        
        <div className="word-strip-translations">
          <p>{firstTranslations}</p>
        </div>
        
        <div className="word-strip-actions">
          <Button
            variant="outline-danger"
            size="sm"
            className="delete-btn me-2"
            onClick={() => onDelete(word)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
          
          <Button
            variant="outline-info"
            size="sm"
            className="expand-btn"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
          </Button>
        </div>
      </div>
      
      <Collapse in={expanded}>
        <div className="word-strip-details">
          <div className="details-header">
            <Badge bg="info" className="article-badge">
              <FontAwesomeIcon icon={faBook} className="me-1" />
              {word.articleTitle || `Article ${word.articleId}`}
            </Badge>
          </div>
          
          <div className="details-content">
            <h6 className="translations-title">
              <FontAwesomeIcon icon={faLanguage} className="me-2" />
              All Translations:
            </h6>
            <div className="translations-container">
              <ul className="translations-list">
                {word.translates.map((translate, i) => (
                  <li key={i} className="translation-item">
                    <strong>{translate.turkish}</strong>
                    <span className="text-muted ms-2">
                      ({translate.type} / {translate.category})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default WordStrip; 