import React, { useState, useEffect, useMemo } from 'react';
import {  Button, Spinner, Alert, Form, Row, Col, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import { useToken } from '../../../context/useToken';
import { fetchVocabularyWords, extractAllWords, shuffleWords } from './apiUtils';
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineFilter, AiOutlineClear } from 'react-icons/ai';
import '../../../assets/styles/testspage.css';

const VocabularyTest = () => {
  const { currentUser } = useAuth();
  const { getToken } = useToken();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allWords, setAllWords] = useState([]); // Store all words for filtering
  const [wordList, setWordList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [noWords, setNoWords] = useState(false);
  
  // Filters
  const [selectedArticle, setSelectedArticle] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadUserWords();
    }
  }, [currentUser]);

  // Get unique articles and difficulty levels for filters
  const uniqueArticles = useMemo(() => {
    const articles = allWords.map(word => ({
      id: word.articleId,
      title: word.articleTitle
    }));
    
    // Remove duplicates
    return [
      { id: 'all', title: 'All Articles' },
      ...Array.from(new Set(articles.map(article => JSON.stringify(article))))
        .map(articleStr => JSON.parse(articleStr))
        .filter(article => article.id !== 'all')
        .sort((a, b) => a.title.localeCompare(b.title))
    ];
  }, [allWords]);

  const uniqueDifficulties = useMemo(() => {
    const difficulties = allWords.map(word => word.difficulty);
    return [
      'all', 
      ...Array.from(new Set(difficulties))
        .sort((a, b) => a.localeCompare(b))
    ];
  }, [allWords]);

  // Load user words from API
  const loadUserWords = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setError("Failed to authenticate. Please try again.");
        setLoading(false);
        return;
      }
      
      const wordsData = await fetchVocabularyWords(token);
      const extractedWords = extractAllWords(wordsData);
      
      if (extractedWords.length === 0) {
        setNoWords(true);
      } else {
        const shuffledWords = shuffleWords(extractedWords);
        setAllWords(shuffledWords);
        setWordList(shuffledWords);
      }
    } catch (err) {
      console.error("Error loading vocabulary words:", err);
      setError("Failed to load vocabulary words. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filteredWords = [...allWords];
    
    if (selectedArticle !== 'all') {
      filteredWords = filteredWords.filter(word => word.articleId.toString() === selectedArticle);
    }
    
    if (selectedDifficulty !== 'all') {
      filteredWords = filteredWords.filter(word => word.difficulty === selectedDifficulty);
    }
    
    setWordList(filteredWords);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const resetFilters = () => {
    setSelectedArticle('all');
    setSelectedDifficulty('all');
    setWordList(allWords);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedArticle, selectedDifficulty]);

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? wordList.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === wordList.length - 1 ? 0 : prevIndex + 1
    );
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const goToCardNumber = (number) => {
    const index = parseInt(number) - 1;
    if (index >= 0 && index < wordList.length) {
      setCurrentIndex(index);
      setIsFlipped(false);
    }
  };

  // Refresh data
  const refreshData = async () => {
    await loadUserWords();
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
            <Button variant="outline-light" size="sm" onClick={refreshData}>
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
          Add words from articles to practice with flash cards!
        </Alert>
      </div>
    );
  }

  if (wordList.length === 0) {
    return (
      <div className="test-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className='test-title'>Vocabulary Flash Cards</h2>
          <Button 
            variant="outline-primary" 
            className="filter-toggle-btn"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
          >
            <AiOutlineFilter className="me-1" /> {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {isFilterVisible && (
          <div className="filter-controls mb-4">
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Article</Form.Label>
                  <Form.Select 
                    value={selectedArticle} 
                    onChange={(e) => setSelectedArticle(e.target.value)}
                  >
                    {uniqueArticles.map(article => (
                      <option key={article.id} value={article.id}>
                        {article.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Difficulty</Form.Label>
                  <Form.Select 
                    value={selectedDifficulty} 
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                  >
                    <option value="all">All Difficulties</option>
                    {uniqueDifficulties.filter(diff => diff !== 'all').map(difficulty => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty.replace('_', '-')}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button 
                  variant="outline-secondary" 
                  className="mb-3 w-100"
                  onClick={resetFilters}
                >
                  <AiOutlineClear className="me-1" /> Reset
                </Button>
              </Col>
            </Row>
          </div>
        )}

        <Alert variant="warning">
          No words match the selected filters. Try changing your filter options or selecting 'All Articles'.
        </Alert>
        <Button variant="primary" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    );
  }

  const currentWord = wordList[currentIndex];

  return (
    <div className="test-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className='test-title'>Vocabulary Flash Cards</h2>
        <Button 
          variant="outline-primary" 
          className="filter-toggle-btn"
          onClick={() => setIsFilterVisible(!isFilterVisible)}
        >
          <AiOutlineFilter className="me-1" /> {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>
      
      {isFilterVisible && (
        <div className="filter-controls mb-4">
          <Row>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label>Filter by Article</Form.Label>
                <Form.Select 
                  value={selectedArticle} 
                  onChange={(e) => setSelectedArticle(e.target.value)}
                >
                  {uniqueArticles.map(article => (
                    <option key={article.id} value={article.id}>
                      {article.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label>Filter by Difficulty</Form.Label>
                <Form.Select 
                  value={selectedDifficulty} 
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  <option value="all">All Difficulties</option>
                  {uniqueDifficulties.filter(diff => diff !== 'all').map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty.replace('_', '-')}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button 
                variant="outline-secondary" 
                className="mb-3 w-100"
                onClick={resetFilters}
              >
                <AiOutlineClear className="me-1" /> Reset
              </Button>
            </Col>
          </Row>
        </div>
      )}

      <p className="mb-4">
        Click on the card to see the translation. Navigate through your words with the arrows.
      </p>

      <div className='card-container'>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <span>Card {currentIndex + 1} of {wordList.length}</span>
            <Dropdown className="ms-3">
              <Dropdown.Toggle variant="outline-secondary" id="card-number-dropdown" size="sm">
                Go to Card
              </Dropdown.Toggle>
              <Dropdown.Menu className="card-number-menu">
                <div className="card-number-scroll">
                  {wordList.map((_, index) => (
                    <Dropdown.Item 
                      key={index} 
                      onClick={() => goToCardNumber(index + 1)}
                      active={index === currentIndex}
                    >
                      {index + 1}: {wordList[index].word}
                    </Dropdown.Item>
                  ))}
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <span className="badge bg-secondary">{currentWord.difficulty}</span>
        </div>
        
        <div 
          className="flash-card mb-4" 
          onClick={toggleFlip}
          style={{ 
            height: '300px',
            cursor: 'pointer',
            perspective: '1000px',
            position: 'relative'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              transition: 'transform 0.5s',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : ''
            }}
          >
            <div className="flash-card-front d-flex flex-column justify-content-center align-items-center">
              <h1 className="mb-3">{currentWord.word}</h1>
              <p className="text-muted">From: {currentWord.articleTitle}</p>
              <small className="mt-4 text-muted">(Click to see translation)</small>
            </div>
            
            <div className="flash-card-back d-flex flex-column justify-content-center align-items-center">
              <h3 className="text-primary mb-4">Translations:</h3>
              <ul className="list-unstyled text-center">
                {currentWord.translates.map((translate, index) => (
                  <li key={index} className="mb-2">
                    <strong>{translate.turkish}</strong> 
                    <span className="text-muted ms-1">({translate.type})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between">
          <Button variant="outline-primary" onClick={handlePrevious}>
            <AiOutlineArrowLeft className="me-1" /> Previous
          </Button>
          <Button variant="outline-primary" onClick={handleNext}>
            Next <AiOutlineArrowRight className="ms-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VocabularyTest; 