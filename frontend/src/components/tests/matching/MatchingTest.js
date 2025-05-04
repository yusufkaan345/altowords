import React, { useState, useEffect } from 'react';
import { Button, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import { useToken } from '../../../context/useToken';
import { fetchVocabularyWords, extractAllWords, submitScore } from '../vocabulary/apiUtils';
import { FaCheck, FaTimes, FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../../../assets/styles/testspage.css';

const MAX_WORDS = 10;

const MatchingTest = () => {
  const { currentUser } = useAuth();
  const { getToken } = useToken();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [words, setWords] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [selectedWordId, setSelectedWordId] = useState(null);
  const [matches, setMatches] = useState({});
  const [checkResults, setCheckResults] = useState(null);
  const [noWords, setNoWords] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [netScore, setNetScore] = useState(0);
  const [expandedTranslations, setExpandedTranslations] = useState({});

  // Load words on mount
  useEffect(() => {
    if (currentUser) {
      loadWords();
    }
  }, [currentUser]);

  const loadWords = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setError("Failed to authenticate. Please try again later.");
        setLoading(false);
        return;
      }
      
      const wordsData = await fetchVocabularyWords(token);
      let extractedWords = extractAllWords(wordsData);
      
      if (extractedWords.length === 0) {
        setNoWords(true);
        setLoading(false);
        return;
      }
      
      // Shuffle and limit to MAX_WORDS
      extractedWords = shuffleArray(extractedWords).slice(0, MAX_WORDS);
      
      // Create a separate array for translations
      const wordItems = extractedWords.map((word, index) => ({
        id: index,
        englishId: word.englishId,
        text: word.word,
        articleTitle: word.articleTitle
      }));
      
      const translationItems = extractedWords.map((word, index) => ({
        id: index,
        englishId: word.englishId,
        // Include all translations (up to 3)
        translations: word.translates.slice(0, 5).map(t => ({
          text: t.turkish,
          type: t.type
        })),
        primaryText: word.translates.slice(0, 3).map(t => ({
          text: t.turkish,
        }))
      }));
      
      setWords(shuffleArray(wordItems));
      setTranslations(shuffleArray(translationItems));
      setSelectedWordId(null);
      setMatches({});
      setCheckResults(null);
    } catch (err) {
      console.error("Error loading vocabulary words:", err);
      setError("Failed to load words. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleWordSelect = (wordId) => {
    setSelectedWordId(wordId);
  };

  const handleTranslationSelect = (translationId) => {
    if (selectedWordId !== null) {
      // Remove the word from any previous match
      const updatedMatches = { ...matches };
      
      // Find and remove if this word was previously matched with another translation
      Object.keys(updatedMatches).forEach(key => {
        if (updatedMatches[key] === selectedWordId) {
          delete updatedMatches[key];
        }
      });
      
      // Add the new match
      updatedMatches[translationId] = selectedWordId;
      
      setMatches(updatedMatches);
      setSelectedWordId(null); // Reset selection after matching
    }
  };

  const getWordById = (wordId) => {
    return words.find(word => word.id === wordId);
  };

  const calculateNetScore = (results) => {
    if (!results) return 0;
    
    const correctCount = Object.values(results).filter(r => r.isCorrect).length;
    const wrongCount = Object.values(results).filter(r => !r.isCorrect).length;
    
    return correctCount - wrongCount;
  };

  const submitUserScore = async (results) => {
    if (scoreSubmitted) return;
    
    try {
      const token = await getToken();
      if (!token) {
        setError("Failed to authenticate. Please try again later.");
        return;
      }
      
      const score = calculateNetScore(results);
      setNetScore(score);
      await submitScore(token, score, currentUser.displayName || currentUser.email);
      setScoreSubmitted(true);
    } catch (err) {
      console.error("Error submitting score:", err);
      setError("Failed to submit score. Please try again later.");
    }
  };

  const checkMatches = () => {
    const results = {};
    
    translations.forEach(translation => {
      const selectedWordId = matches[translation.id];
      if (selectedWordId !== undefined) {
        const selectedWord = getWordById(selectedWordId);
        results[translation.id] = {
          isCorrect: selectedWord.englishId === translation.englishId,
          correctWordId: words.find(w => w.englishId === translation.englishId).id
        };
      } else {
        results[translation.id] = {
          isCorrect: false,
          correctWordId: words.find(w => w.englishId === translation.englishId).id
        };
      }
    });
    
    setCheckResults(results);
    submitUserScore(results);
  };

  const resetTest = () => {
    setSelectedWordId(null);
    setMatches({});
    setCheckResults(null);
    setScoreSubmitted(false);
    loadWords();
  };

  const toggleTranslation = (translationId) => {
    setExpandedTranslations(prev => ({
      ...prev,
      [translationId]: !prev[translationId]
    }));
  };

  if (loading) {
    return (
      <div className="test-container d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status" className="text-light">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-container">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button variant="outline-light" size="sm" onClick={loadWords}>
              Try Again
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (noWords) {
    return (
      <div className="test-container">
        <Alert variant="info">
          You don't have any saved words yet. 
          Add words from articles to practice matching exercises!
        </Alert>
      </div>
    );
  }

  return (
    <div className="test-container">
      <h2 className="test-title mb-3">Word Matching Game</h2>
      
      <div className="instructions mb-4">
        <Alert variant="info" className="matching-instructions">
          <p className="mb-1"><strong>How to play:</strong></p>
          <ol className="mb-0">
            <li>Select an English word from the left panel</li>
            <li>Then click on its matching Turkish translation on the right</li>
            <li>When you've matched all words, click "Check Answers"</li>
          </ol>
        </Alert>
      </div>
      
      {checkResults && scoreSubmitted && (
        <Alert variant="success" className="mb-3">
          <strong>{netScore} Points</strong> have been added to your score!
        </Alert>
      )}
      
      <Row className="matching-game-container">
        <Col md={5}>
          <h4 className="text-center mb-3">English Words</h4>
          <div className="matching-words">
            {words.map(word => {
              // Find if this word is matched with any translation
              const matchedTranslationId = Object.keys(matches).find(key => matches[key] === word.id);
              const isSelected = selectedWordId === word.id;
              const isMatched = matchedTranslationId !== undefined;
              
              // Get result status if we have check results
              let resultStatus = '';
              if (checkResults && isMatched) {
                resultStatus = checkResults[matchedTranslationId]?.isCorrect ? 'correct' : 'incorrect';
              }
              
              let statusClass = isSelected ? 'selected' : '';
              if (isMatched) statusClass = 'matched';
              if (resultStatus) statusClass = resultStatus;
              
              return (
                <Card 
                  key={word.id} 
                  className={`matching-card word-card mb-2 ${statusClass}`}
                  onClick={() => !checkResults && handleWordSelect(word.id)}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="word-text">{word.text.toLowerCase()}</div>
                        <small className="text-muted">{word.articleTitle}</small>
                      </div>
                      
                      {isSelected && !checkResults && (
                        <div className="select-indicator">
                          <div className="dot"></div>
                        </div>
                      )}
                      
                      {checkResults && isMatched && (
                        checkResults[matchedTranslationId]?.isCorrect ? 
                          <FaCheck className="result-icon correct" /> : 
                          <FaTimes className="result-icon incorrect" />
                      )}
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </Col>
        
        <Col md={2} className="d-flex justify-content-center align-items-center">
          <div className="matching-arrows text-center">
            <FaArrowRight size={32} className="matching-arrow" />
          </div>
        </Col>
        
        <Col md={5}>
          <h4 className="text-center mb-3">Turkish Translations</h4>
          <div className="matching-translations">
            {translations.map(translation => {
              const matchedWordId = matches[translation.id];
              const matchedWord = matchedWordId !== undefined ? getWordById(matchedWordId) : null;
              
              let statusClass = '';
              
              if (checkResults) {
                statusClass = checkResults[translation.id]?.isCorrect ? 'correct' : 'incorrect';
              } else if (matchedWordId !== undefined) {
                statusClass = 'matched';
              }
              
              return (
                <Card 
                  key={translation.id} 
                  className={`matching-card translation-card mb-2 ${statusClass}`}
                  onClick={() => !checkResults && selectedWordId !== null && handleTranslationSelect(translation.id)}
                >
                  <Card.Body>
                    <div className="d-flex flex-column w-100">
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="translation-content">
                          <div className="translation-text-container d-flex align-items-center justify-content-between">
                            <div className="translation-text">
                              {translation.translations.slice(0, 3).map((t, idx) => (
                                <span key={idx} className="translation-item">
                                  {idx > 0 && ', '}
                                  {t.text}
                                </span>
                              ))}
                            </div>
                            <div className="translation-toggle" onClick={(e) => {
                              e.stopPropagation();
                              toggleTranslation(translation.id);
                            }}>
                              {expandedTranslations[translation.id] ? 
                                <FaChevronUp className="toggle-icon" color='white' /> : 
                                <FaChevronDown className="toggle-icon" color='orange' />
                              }
                            </div>
                          </div>
                        </div>
                        
                        {matchedWord && !checkResults && (
                          <div className="matched-word">
                            {matchedWord.text}
                          </div>
                        )}
                        
                        {checkResults && (
                          <div className="d-flex align-items-center">
                            {checkResults[translation.id]?.isCorrect ? (
                              <FaCheck className="result-icon correct" />
                            ) : (
                              <div className="correct-word">
                                {getWordById(checkResults[translation.id].correctWordId).text}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {expandedTranslations[translation.id] && (
                        <div className="translation-details mt-2">
                          {translation.translations.map((t, idx) => (
                            <span key={idx} className="translation-item">
                              {idx > 0 && ', '}
                              {t.text}
                              <small className="translation-type">({t.type})</small>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </Col>
      </Row>
      
      <div className="d-flex justify-content-center mt-4">
        {checkResults ? (
          <Button variant="primary" onClick={resetTest}>
            New Game
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={checkMatches}
            disabled={Object.keys(matches).length < translations.length}
          >
            Check Answers
          </Button>
        )}
      </div>
      
      {checkResults && (
        <div className="mt-4">
          <h4 className="text-center">Results</h4>
          <div className="results-summary text-center mb-3">
            {Object.values(checkResults).filter(r => r.isCorrect).length} out of {translations.length} correct
          </div>
          
          <div className="results-net-score text-center mb-3">
            <p>Correct answers: {Object.values(checkResults).filter(r => r.isCorrect).length}</p>
            <p>Wrong answers: {Object.values(checkResults).filter(r => !r.isCorrect).length}</p>
            <p><strong>Net score (Correct - Wrong): {calculateNetScore(checkResults)}</strong></p>
          </div>
          
          {Object.values(checkResults).some(r => !r.isCorrect) && (
            <div className="incorrect-answers mt-3">
              <h5>Correct Answers:</h5>
              <ul className="list-unstyled">
                {translations.map(translation => {
                  if (!checkResults[translation.id]?.isCorrect) {
                    const correctWord = getWordById(checkResults[translation.id].correctWordId);
                    return (
                      <li key={translation.id} className="incorrect-answer-item">
                        <strong>{correctWord.text}</strong> = {translation.translations.map((t, idx) => (
                          <span key={idx}>
                            {idx > 0 && ', '}
                            {t.text} <small>({t.type})</small>
                          </span>
                        ))}
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchingTest; 