import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import TopMenu from '../components/main/TopMenu';
import WordDetailsPopup from '../components/article/WordDetailsPopup';
import WordList from '../components/article/WordList';
import ArticleContent from '../components/article/ArticleContent';
import SaveButton from '../components/article/SaveButton';
import { useAuth } from '../context/AuthContext';
import { useToken } from '../context/useToken';
import {  fetchArticleWords, saveArticleWords } from '../components/article/utils/articleWordApi';
import { calculatePopupPosition, getStemmedWord, processWord, fetchWordTranslation } from '../components/article/utils/articleUtils';
import '../assets/styles/articlepage.css';

/**
 * ArticlePage Component
 * Displays an article with interactive word selection, translation,
 * and word list saving functionality.
 */
function ArticlePage() {
  // Navigation and auth
  const { state } = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getToken } = useToken();

  // Word selection and translation states
  const [selectedWord, setSelectedWord] = useState(null);
  const [wordPosition, setWordPosition] = useState({ x: 0, y: 0 });
  const [translation, setTranslation] = useState(null);
  const [wordEnglishId, setWordEnglishId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Word list and UI states
  const [wordList, setWordList] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const stemCacheRef = useRef({});  // Using ref instead of state for caching to avoid re-renders

  // Saved words states - using ref to avoid re-renders when just caching data
  const savedWordsMapRef = useRef(new Map());
  const [currentArticleWords, setCurrentArticleWords] = useState([]);

  // Last translation cache to avoid repeated API calls - using ref to avoid re-renders
  const translationCacheRef = useRef(new Map());

  // Refs
  const wordDetailsRef = useRef(null);
  const articleContainerRef = useRef(null);

  // Extract article data from state
  const { title, image, difficulty, content } = state || {};

  // Check if no article data is available - moved to a variable for use after hooks
  const noArticleData = !state?.title || !state?.content;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/', { state: { openSignupModal: true } });
    }
  }, [currentUser, navigate]);

  // Close word details when clicking outside - optimized with useCallback
  const handleClickOutside = useCallback((event) => {
    if (wordDetailsRef.current && !wordDetailsRef.current.contains(event.target) &&
      !event.target.classList.contains('clickable-word')) {
      setSelectedWord(null);
      setTranslation(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Auto-hide notification after 3 seconds - optimized with useCallback
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Extract articleId from the articles array if available
  const articleId = useMemo(() => {
    if (!state) return 0;
    return state.articleId ? state.articleId :
      (state.articles && state.articles.length > 0 ?
        state.articles.find(a => a.difficulty === difficulty?.replace('-', '_'))?.articleId : 0);
  }, [state, difficulty]);

  // Load saved words when component mounts
  useEffect(() => {
    if (currentUser && articleId) {
      loadSavedWords();
    }
  }, [currentUser, articleId]);

  /**
   * Load all saved words for the current user and article
   */
  const loadSavedWords = useCallback(async () => {
    if (!currentUser) return;

    try {
      const token = await getToken();
      const allWords = await fetchArticleWords(token, articleId);
      if (allWords && allWords.length > 0) {
        // Create a map of word -> {articleId, articleTitle} for quick lookups
        const wordsMap = new Map();
        const currArticleWords = [];
        allWords.forEach(article => {
          article.words.forEach(word => {
            const lowercase = word.word.toLowerCase();
            wordsMap.set(lowercase, {
              word: lowercase,
              englishId: word.englishId,
              articleId: article.articleId,
              articleTitle: article.articleTitle
            });

            // Store current article words separately
            if (article.articleId === articleId) {
              currArticleWords.push(lowercase);

              // Also store the stemmed version
              const stemmed = getStemmedWord(lowercase, stemCacheRef.current);
              if (stemmed !== lowercase) {
                stemCacheRef.current[lowercase] = stemmed;
                currArticleWords.push(stemmed);
              }
            }
          });
        });

        savedWordsMapRef.current = wordsMap;
        setCurrentArticleWords(currArticleWords);
      }
    } catch (error) {
      console.error('Error loading saved words:', error);
      setNotification({
        type: 'warning',
        message: 'Could not load your saved words. Some words might be shown as unsaved.'
      });
    }
  }, [currentUser, articleId]);

  // Memoize word checks to reduce recalculations
  const checkWordStatus = useCallback((word) => {
    if (!word) return { inWordList: false, alreadySaved: null, inCurrentArticle: false };

    const cleanWord = word.toLowerCase();

    // Check if in current word list
    const inWordList = wordList.some(item => item.original.toLowerCase() === cleanWord);

    // Get the stemmed version of the word
    const stemmedWord = stemCacheRef.current[cleanWord] || getStemmedWord(cleanWord, stemCacheRef.current);

    // Store in cache for future use
    if (!stemCacheRef.current[cleanWord]) {
      stemCacheRef.current[cleanWord] = stemmedWord;
    }

    // Check if already saved in another article - check both clean and stemmed versions
    let alreadySaved = savedWordsMapRef.current.get(cleanWord);

    // If not found by clean word, try looking up by stemmed word
    if (!alreadySaved && stemmedWord !== cleanWord) {
      alreadySaved = savedWordsMapRef.current.get(stemmedWord);
    }

    // Check if saved in current article - include stemmed version check
    const inCurrentArticle = currentArticleWords.includes(cleanWord) ||
      (stemmedWord !== cleanWord && currentArticleWords.includes(stemmedWord));

    return { inWordList, alreadySaved, inCurrentArticle };
  }, [wordList, currentArticleWords]);

  // Fetch translation when a word is selected
  useEffect(() => {
    if (selectedWord) {
      fetchTranslation(selectedWord);
    } else {
      setTranslation(null);
      setWordEnglishId(null);
      setIsLoading(false);
    }
  }, [selectedWord]);

  /**
   * Fetch translation from API for a selected word - optimized with caching
   * @param {string} word - The word to translate
   */
  const fetchTranslation = useCallback(async (word) => {
    setIsLoading(true);
    setTranslation(null);

    try {
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"?]/g, '').toLowerCase();

      // Check if we already have this translation cached
      if (translationCacheRef.current.has(cleanWord)) {
        const cachedResult = translationCacheRef.current.get(cleanWord);
        setTranslation(cachedResult.translations);
        setWordEnglishId(cachedResult.englishId);
        setIsLoading(false);
        return;
      }

      // If not cached, fetch from API
      const result = await fetchWordTranslation(word, stemCacheRef.current);

      if (result.success) {
        setTranslation(result.translations);
        setWordEnglishId(result.englishId);

        // Cache the translation result
        translationCacheRef.current.set(cleanWord, {
          translations: result.translations,
          englishId: result.englishId
        });

        // Update the stemming cache as well
        const stemmedWord = getStemmedWord(cleanWord, stemCacheRef.current);
        stemCacheRef.current[cleanWord] = stemmedWord;
      } else {
        setTranslation([]);
        setWordEnglishId(null);
      }
    } catch (error) {
      console.error('Error fetching translation:', error);
      setTranslation([]);
      setWordEnglishId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add a word to the user's word list
   * @param {string} word - The word to add to the list
   */
  const addWordToList = useCallback((word) => {
    const processedWordObj = processWord(word, stemCacheRef.current);

    // Check if word or its root already exists in the list
    if (wordList.some(item => item.stemmed === processedWordObj.stemmed)) {
      setNotification({
        type: 'warning',
        message: `A word with the same root "${processedWordObj.stemmed}" already exists in your list.`
      });
      setSelectedWord(null);
      return;
    }

    // Check if already saved in any article
    const { alreadySaved } = checkWordStatus(word);
    if (alreadySaved) {
      setNotification({
        type: 'warning',
        message: `"${word}" is already saved in another article.`
      });
      setSelectedWord(null);
      return;
    }

    // Get translation data 
    const displayTranslation = translation && translation.length > 0 ? translation[0] : null;

    // Add translation to the word object
    const wordWithTranslation = {
      ...processedWordObj,
      translation: displayTranslation, // First meaning for display
      englishId: wordEnglishId,
    };
    setWordList(prevList => [...prevList, wordWithTranslation]);
    setNotification({
      type: 'success',
      message: `"${processedWordObj.original}" added to your word list.`
    });

    // Close the popup
    setSelectedWord(null);
  }, [wordList, translation, wordEnglishId, checkWordStatus]);

  /**
   * Remove a word from the list
   * @param {string} wordToRemove - The word to remove (stemmed form)
   */
  const removeWordFromList = useCallback((wordToRemove) => {
    setWordList(prevList => prevList.filter(item => item.stemmed !== wordToRemove));
  }, []);

  /**
   * Render text with clickable words - memoized for performance
   * @param {string} text - The text to render
   * @returns {Array} - Array of spans with clickable words
   */
  const renderClickableWords = useCallback((text) => {
    if (!text) return null;

    // Split by whitespace but keep the whitespace
    return text.split(/(\s+)/).map((word, index) => {
      // Skip empty strings and whitespace
      if (!word.trim()) return <span key={index}>{word}</span>;

      // Remove punctuation from the word for display and selection
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"?]/g, '').toLowerCase();

      if (cleanWord.length < 2) return <span key={index}>{word}</span>;

      // Check the word status
      const { inWordList, alreadySaved, inCurrentArticle } = checkWordStatus(cleanWord);

      // Set appropriate class based on status
      let className = 'clickable-word';
      if (inWordList || inCurrentArticle) {
        className += ' word-in-list';
      } else if (alreadySaved) {
        className += ' word-already-saved';
      }

      return (
        <span
          key={index}
          className={className}
          onClick={(e) => {
            // Get position of the clicked word
            const rect = e.target.getBoundingClientRect();
            const containerRect = articleContainerRef.current.getBoundingClientRect();

            // Calculate position relative to the container
            const position = calculatePopupPosition(rect, containerRect);
            setWordPosition(position);
            setSelectedWord(cleanWord);
          }}
        >
          {word}
        </span>
      );
    });
  }, [checkWordStatus]);

  /**
   * Save words to database and handle success/failure
   */
  const handleSaveAndFinish = useCallback(async () => {
    // Check if there are words to save
    if (wordList.length === 0) {
      setNotification({
        type: 'warning',
        message: 'No words to save. Please add some words to your list first.'
      });
      return;
    }

    // Start loading
    setIsSaving(true);

    try {
      const token = await getToken();
      // Prepare the data to send in required format
      const wordsToSave = wordList.map(word => ({
        englishId: word.englishId
      }));

      // Send to our utility function
      await saveArticleWords(token, articleId || 0, wordsToSave);

      // Show success notification
      setNotification({
        type: 'success',
        message: 'Words saved successfully!'
      });

      // Redirect after 1 second with articleId
      setTimeout(() => {
        navigate('/mywords', {
          state: { articleId: articleId || 0 }
        });
      }, 1000);
    } catch (error) {
      console.error('Error saving words:', error);

      // Show error notification
      setNotification({
        type: 'danger',
        message: 'An error occurred while saving. Please try again.'
      });
    } finally {
      // Stop loading
      setIsSaving(false);
    }
  }, [wordList, currentUser, articleId, navigate]);

  // Redirect to main page if no article data is available - moved after all hooks
  if (noArticleData) {
    return <Navigate to="/main" replace />;
  }

  // Render the component
  return (
    <div className="article-page">
      <TopMenu />
      <Container fluid className="article-container" ref={articleContainerRef}>
        {/* Notification */}
        {notification && (
          <div className="notification-container">
            <Alert
              variant={notification.type}
              onClose={() => setNotification(null)}
              dismissible
              className="notification-alert"
            >
              <FontAwesomeIcon icon={faInfoCircle} /> {notification.message}
            </Alert>
          </div>
        )}

        <Row>
          {/* Sidebar */}
          <Col md={5} lg={2} className="sidebar-article">

            <WordList
              wordList={wordList}
              onRemoveWord={removeWordFromList}
            />

          </Col>

          {/* Main Content */}
          <Col md={9} lg={9} className='main-content'>
            <Button
              variant="link"
              className="back-button"
              onClick={() => navigate('/main')}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Back to Main Page
            </Button>

            <ArticleContent
              title={title}
              image={image}
              difficulty={difficulty}
              content={content}
              renderClickableWords={renderClickableWords}
            />
             <SaveButton onSave={handleSaveAndFinish} isLoading={isSaving} />
            <Row>
              <Button
                variant="link"
                className="back-button-bottom"
                onClick={() => navigate('/main')}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Back to Main Page
              </Button>
              {/* Save and Finish Button */}
             
            </Row>

          </Col>
        </Row>

        {/* Word Details Popup */}
        <WordDetailsPopup
          ref={wordDetailsRef}
          selectedWord={selectedWord}
          wordPosition={wordPosition}
          translation={translation}
          isLoading={isLoading}
          onClose={() => {
            setSelectedWord(null);
          }}
          onAddToList={addWordToList}
          processWord={word => processWord(word, stemCacheRef.current)}
          alreadySavedWord={selectedWord ? checkWordStatus(selectedWord).alreadySaved : null}
          savedInCurrentArticle={selectedWord ? checkWordStatus(selectedWord).inCurrentArticle : false}
        />
      </Container>
    </div>
  );
}

export default React.memo(ArticlePage);