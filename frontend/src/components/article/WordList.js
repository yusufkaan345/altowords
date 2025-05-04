import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const WordList = ({ wordList, onRemoveWord }) => {
  return (
    <div className="sidebar-article-content">
      <h3 className="sidebar-article-title">Word List</h3>
      <ul className="sidebar-article-menu">
        {wordList.length === 0 ? (
          <li className="empty-list-message">No words added yet</li>
        ) : (
          wordList.map((word, index) => (
            <li key={index} className="word-list-item">
              <div className="word-info">
                <span className="word-original">{word.original}</span>
                {word.stemmed && word.stemmed !== word.original && (
                  <span className="word-stemmed">Root: {word.stemmed}</span>
                )}
                {word.translation && (
                  <span className="word-translation">{word.translation}</span>
                )}
              </div>
              <Button 
                variant="link" 
                className="remove-word-button"
                onClick={() => onRemoveWord(word.stemmed)}
                aria-label="Remove word"
              >
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default WordList; 