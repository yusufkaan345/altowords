import React, { useState, useEffect } from 'react';
import { Button, Alert, Spinner, Card, Form, ProgressBar, Badge } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import { useToken } from '../../../context/useToken';
import { fetchVocabularyWords, extractAllWords, submitScore } from '../vocabulary/apiUtils';
import { FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';
import '../../../assets/styles/testspage.css';

const MAX_WORDS = 10;
const OPTIONS_PER_QUESTION = 5;

// Default Turkish translations to use when not enough words are available
const DEFAULT_TRANSLATIONS = [
  "incelemek, araştırmak",
  "korkmak, ürkmek, irkilmek",
  "hilekar, düzenbaz, sahtekar",
  "kent, şehir, ilçe",
  "ekonomik, parasal, piyasa"
];

const MultipleChoiceTest = () => {
  const { currentUser } = useAuth();
  const { getToken } = useToken();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [noWords, setNoWords] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [netScore, setNetScore] = useState(0);

  // Load words on mount
  useEffect(() => {
    if (currentUser) {
      loadQuestions();
    }
  }, [currentUser]);

  const loadQuestions = async () => {
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
      
      // Create questions
      const generatedQuestions = createQuestions(extractedWords);
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
    } catch (err) {
      console.error("Error loading vocabulary words:", err);
      setError("Failed to load words. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const createQuestions = (words) => {
    // If fewer than 5 words, use default translations to supplement
    const needsDefaults = words.length < OPTIONS_PER_QUESTION;
    
    return words.map((word, index) => {
      // For each word, we need to create a question with options
      const correctAnswer = {
        id: `${index}-correct`,
        text: getAllTranslations(word),
        isCorrect: true
      };
      
      // Generate incorrect options from other words' translations
      let incorrectOptions = [];
      
      if (needsDefaults) {
        // Use default translations
        incorrectOptions = DEFAULT_TRANSLATIONS
          .filter(t => t !== correctAnswer.text)
          .map((text, idx) => ({
            id: `${index}-incorrect-${idx}`,
            text: text,
            isCorrect: false
          }));
      } else {
        // Use translations from other words
        const otherWords = words.filter(w => w.englishId !== word.englishId);
        incorrectOptions = shuffleArray(otherWords)
          .slice(0, OPTIONS_PER_QUESTION - 1)
          .map((w, idx) => ({
            id: `${index}-incorrect-${idx}`,
            text:getAllTranslations(w),
            isCorrect: false
          }));
      }
      
      // Combine correct answer with incorrect options and shuffle
      const allOptions = shuffleArray([correctAnswer, ...incorrectOptions]).slice(0, 5);
      
      return {
        id: index,
        englishId: word.englishId,
        word: word.word,
        articleTitle: word.articleTitle,
        options: allOptions,
        correctOptionId: correctAnswer.id
      };
    });
  };
  const getAllTranslations = (word) => {
    return word.translates.slice(0, 4).map(t => t.turkish).join(", ");
  };
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswerSelect = (optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionId
    });
  };

  const getCorrectAnswersCount = () => {
    let correctCount = 0;
    Object.keys(selectedAnswers).forEach(questionIndex => {
      const question = questions[questionIndex];
      if (question.correctOptionId === selectedAnswers[questionIndex]) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const getWrongAnswersCount = () => {
    let wrongCount = 0;
    Object.keys(selectedAnswers).forEach(questionIndex => {
      const question = questions[questionIndex];
      if (question.correctOptionId !== selectedAnswers[questionIndex]) {
        wrongCount++;
      }
    });
    return wrongCount;
  };

  const calculateNetScore = () => {
    const correctCount = getCorrectAnswersCount();
    const wrongCount = getWrongAnswersCount();
    return correctCount - wrongCount;
  };

  const submitUserScore = async () => {
    if (scoreSubmitted) return;
    
    try {
      const token = await getToken();
      if (!token) {
        setError("Failed to authenticate. Please try again later.");
        return;
      }
      
      const score = calculateNetScore();
      setNetScore(score);
      await submitScore(token, score, currentUser.displayName || currentUser.email);
      setScoreSubmitted(true);
    } catch (err) {
      console.error("Error submitting score:", err);
      setError("Failed to submit score. Please try again later.");
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
      submitUserScore();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScoreSubmitted(false);
    loadQuestions();
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
            <Button variant="outline-light" size="sm" onClick={loadQuestions}>
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
          Add words from articles to practice with multiple choice questions!
        </Alert>
      </div>
    );
  }

  if (showResults) {
    const correctCount = getCorrectAnswersCount();
    const wrongCount = getWrongAnswersCount();
    const netScore = calculateNetScore();
    const percentage = Math.round((correctCount / questions.length) * 100);
    
    return (
      <div className="test-container">
        <h2 className="test-title mb-3">Multiple Choice Test Results</h2>
        
        {scoreSubmitted && (
          <Alert variant="success" className="mb-3">
            <strong>{netScore} Points</strong> have been added to your score!
          </Alert>
        )}
        
        <div className="results-container">
          <div className="results-summary mb-4">
            <h4>Your Score</h4>
            <div className="score-display mb-3">
              <span className="score-number">{correctCount}</span> / {questions.length}
              <Badge 
                bg={percentage >= 80 ? "success" : percentage >= 60 ? "warning" : "danger"}
                className="ms-3"
              >
                {percentage}%
              </Badge>
            </div>
            
            <div className="net-score mb-3">
              <p>Correct answers: {correctCount}</p>
              <p>Wrong answers: {wrongCount}</p>
              <p><strong>Net score (Correct - Wrong): {netScore}</strong></p>
            </div>
            
            <ProgressBar
              now={percentage}
              variant={percentage >= 80 ? "success" : percentage >= 60 ? "warning" : "danger"}
              className="mb-4"
            />
          </div>
          
          <div className="question-review">
            <h5>Review Your Answers</h5>
            {questions.map((question, index) => {
              const userSelectedOption = question.options.find(o => o.id === selectedAnswers[index]);
              const correctOption = question.options.find(o => o.id === question.correctOptionId);
              const isCorrect = userSelectedOption && userSelectedOption.id === correctOption.id;
              
              return (
                <Card key={index} className={`question-review-card mb-3 ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <h6 className="question-word">{question.word}</h6>
                      {isCorrect ? 
                        <FaCheck className="result-icon correct" /> : 
                        <FaTimes className="result-icon incorrect" />
                      }
                    </div>
                    <p className="text-muted small mb-2 text-white">From: {question.articleTitle}</p>
                    
                    <div className="answer-review">
                      {userSelectedOption && (
                        <div className="mb-2">
                          <span className="answer-label">Your answer:</span> {userSelectedOption.text}
                        </div>
                      )}
                      
                      {!isCorrect && (
                        <div className="correct-answer">
                          <span className="answer-label">Correct answer:</span> {correctOption.text}
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
          
          <div className="d-flex justify-content-center mt-4">
            <Button variant="primary" onClick={resetTest}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const hasSelectedAnswer = selectedAnswers[currentQuestionIndex] !== undefined;
  const answeredQuestionsCount = Object.keys(selectedAnswers).length;
  const progress = Math.round((answeredQuestionsCount / questions.length) * 100);

  return (
    <div className="test-container">
      <h2 className="test-title mb-3">Multiple Choice Test</h2>
      
      <div className="instructions mb-4">
        <Alert variant="info" className="matching-instructions">
          <p className="mb-1"><strong>How to play:</strong></p>
          <p className="mb-0">Select the correct Turkish translation for each English word.</p>
        </Alert>
      </div>
      
      <div className="progress-tracker mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length } </span>
        </div>
        <ProgressBar now={progress} variant="info" />
      </div>
      
      <div className="question-container">
        <Card className="question-card mb-4">
          <Card.Body>
            <h3 className="question-word mb-1">{currentQuestion.word}</h3>
            <p className="text-muted small text-white">From: {currentQuestion.articleTitle}</p>
          </Card.Body>
        </Card>
        
        <div className="options-container">
          <p className="mb-3 fw-bold">Select the correct meaning:</p>
          
          <div className="radio-options-list">
            {currentQuestion.options.map(option => (
              <div 
                key={option.id} 
                className={`option-item mb-3 ${selectedAnswers[currentQuestionIndex] === option.id ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(option.id)}
              >
                <div className="option-content d-flex align-items-center">
                  <Form.Check
                    type="radio"
                    id={`option-${option.id}`}
                    checked={selectedAnswers[currentQuestionIndex] === option.id}
                    onChange={() => {}} // We're handling changes through the onClick of the parent div
                    className="option-radio"
                  />
                  <span className="option-label">{option.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="navigation-buttons d-flex justify-content-between mt-4">
          <Button
            variant="outline-secondary"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          <Button
            variant="primary"
            onClick={goToNextQuestion}
            disabled={!hasSelectedAnswer}
          >
            {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish Test"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceTest; 