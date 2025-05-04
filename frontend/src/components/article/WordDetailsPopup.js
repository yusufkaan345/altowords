import React, { forwardRef, memo } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const WordDetailsPopup = forwardRef(({ 
  selectedWord, 
  wordPosition, 
  translation, 
  isLoading,
  onClose, 
  onAddToList, 
  processWord,
  alreadySavedWord,
  savedInCurrentArticle
}, ref) => {
  if (!selectedWord) return null;

  // Get the stemmed form of the word
  const { original, stemmed } = processWord(selectedWord);
  
  const isAlreadySaved = alreadySavedWord && alreadySavedWord.word && alreadySavedWord.articleId;
  const isSavedInCurrentArticle = savedInCurrentArticle;

  return (
    <div 
      ref={ref}
      className="word-details-popup"
      style={{
        position: 'absolute',
        left: `${wordPosition.x}px`,
        top: `${wordPosition.y}px`,
        zIndex: 1000
      }}
    >
      <div className="word-details-header">
        <h4>Selected Word</h4>
        <Button 
          variant="link" 
          className="close-button"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </div>
      <p className="selected-word">{selectedWord}</p>
      {selectedWord && (
        <div className="lemmatized-word">
          <p>Root: <span className="root-word">{stemmed}</span></p>
        
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : translation && translation.length > 0 ? (
            <div className="word-meanings">
              <p className="word-meaning">Meanings:</p>
              <ul className="meanings-list">
                {translation.map((meaning, index) => (
                  <li key={index} className="meaning-item">
                    <span className="turkish-meaning">{meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="word-meanings unknown-word">
              <p className="meaning-error">
                <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" /> 
                <span>Sorry! Unknown word</span>
              </p>
            </div>
          )}
        </div>
      )}
      <div className="word-actions">
        {isSavedInCurrentArticle ? (
          <div className="already-saved-message">
            <FontAwesomeIcon icon={faCheckCircle} className="check-icon" /> 
            <span>Already in your list for this article</span>
          </div>
        ) : isAlreadySaved ? (
          <div className="already-saved-message">
            <FontAwesomeIcon icon={faCheckCircle} className="check-icon" /> 
            <span>Already saved in article: {alreadySavedWord.articleTitle || `Article ${alreadySavedWord.articleId}`}</span>
          </div>
        ) : translation && translation.length > 0 ? (
          <Button 
            size="sm" 
            variant="outline-light"
            onClick={() => onAddToList(selectedWord)}
            disabled={isLoading || isAlreadySaved || isSavedInCurrentArticle}
          >
            +Add List
          </Button>
        ) : null}
      </div>
    </div>
  );
});

// Gereksiz yeniden render işlemlerini önlemek için memoize ediyoruz
export default memo(WordDetailsPopup); 