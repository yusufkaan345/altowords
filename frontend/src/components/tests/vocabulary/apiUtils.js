/**
 * Fetches all words saved by a user for vocabulary tests
 * @param {string} token - The Firebase authentication token
 * @returns {Promise<Array>} - Array of article data with words
 */
export const fetchVocabularyWords = async (token) => {
  try {
    const response = await fetch(`http://localhost:8080/api/user-word/words`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch vocabulary words');
    }
    
    const data = await response.json();
    
    // Sort articles by ID in descending order (newest first)
    return data.sort((a, b) => b.articleId - a.articleId);
  } catch (error) {
    console.error('Error fetching vocabulary words:', error);
    throw error;
  }
};

/**
 * Extracts all words with their translations from the API response
 * @param {Array} wordData - The array of article data with words
 * @returns {Array} - Flat array of all words with article info
 */
export const extractAllWords = (wordData) => {
  const allWords = [];
  
  wordData.forEach(article => {
    article.words.forEach(word => {
      // Limit translations to first 5
      const limitedTranslates = word.translates.slice(0, 7);
      
      allWords.push({
        ...word,
        translates: limitedTranslates,
        articleId: article.articleId,
        articleTitle: article.articleTitle,
        difficulty: article.difficulty
      });
    });
  });
  
  return allWords;
};

/**
 * Shuffles an array of words for random presentation
 * @param {Array} words - Array of word objects
 * @returns {Array} - Shuffled array
 */
export const shuffleWords = (words) => {
  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Submits a user's test score to the server
 * @param {string} token - The Firebase authentication token
 * @param {number} score - The score to submit
 * @param {string} username - The Firebase username
 * @returns {Promise<Object>} - The server response
 */
export const submitScore = async (token, score, username) => {
  try {
    const response = await fetch(`http://localhost:8080/api/score/add?score=${score}&username=${username}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit score');
    }
    
    // Check if there's content to parse
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch (e) {
        console.log('Could not parse JSON response, returning success status');
        return { success: true };
      }
    } else {
      // If not JSON, just return success status
      return { success: true };
    }
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
}; 