import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToken } from '../context/useToken';
import { fetchUserWords, extractArticles, filterWordData, deleteUserWord } from '../components/mywords/apiUtils';

/**
 * Custom hook for fetching and managing user words
 */
export const useUserWords = () => {
  const { currentUser } = useAuth();
  const { getToken } = useToken();
  const [wordData, setWordData] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArticle, setFilterArticle] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [wordTypes, setWordTypes] = useState([]);

  // Fetch user words on mount
  useEffect(() => {
    if (currentUser) {
      loadUserWords();
    }
  }, [currentUser]);

  // Apply filters when filter settings or data changes
  useEffect(() => {
    if (wordData.length > 0) {
      let filtered = filterWordData(wordData, searchTerm, filterArticle);
      
      // Apply type filter if selected
      if (filterType !== 'all') {
        filtered = filtered.filter(word => 
          word.translates.some(translate => translate.type === filterType)
        );
      }
      
      setFilteredWords(filtered);
    }
  }, [wordData, searchTerm, filterArticle, filterType]);

  // Extract unique word types from fetched data
  useEffect(() => {
    if (wordData.length > 0) {
      const types = new Set();
      
      wordData.forEach(article => {
        article.words.forEach(word => {
          word.translates.forEach(translate => {
            if (translate.type) {
              types.add(translate.type);
            }
          });
        });
      });
      
      setWordTypes(Array.from(types).sort());
    }
  }, [wordData]);

  // Load user words from API
  const loadUserWords = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setError('Failed to authenticate. Please try again later.');
        setLoading(false);
        return;
      }
      
      const data = await fetchUserWords(token);
      setWordData(data);
      
      // Extract unique articles
      const articleList = extractArticles(data);
      setArticles(articleList);
      
      setError(null);
    } catch (err) {
      setError('Failed to load your saved words. Please try again later.');
      console.error('Error loading user words:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterArticle('all');
    setFilterType('all');
  };

  // Delete a word
  const deleteWord = async (word) => {
    if (!currentUser) return;
    
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication failed');
      }
      
      await deleteUserWord(token, word.articleId, word.englishId);
      
      // Update local state
      const updatedData = wordData.map(article => {
        if (article.articleId === word.articleId) {
          return {
            ...article,
            words: article.words.filter(w => w.englishId !== word.englishId)
          };
        }
        return article;
      }).filter(article => article.words.length > 0);
      
      setWordData(updatedData);
      
      // Also update filteredWords directly to ensure UI updates immediately
      setFilteredWords(prevFiltered => 
        prevFiltered.filter(w => 
          !(w.articleId === word.articleId && w.englishId === word.englishId)
        )
      );
      
      // Re-extract articles if needed
      if (updatedData.length !== wordData.length) {
        setArticles(extractArticles(updatedData));
      }
    } catch (error) {
      setError('Failed to delete word. Please try again.');
      console.error('Error deleting word:', error);
    }
  };

  return {
    wordData,
    filteredWords,
    articles,
    wordTypes,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterArticle,
    setFilterArticle,
    filterType,
    setFilterType,
    resetFilters,
    deleteWord,
    refresh: loadUserWords
  };
}; 