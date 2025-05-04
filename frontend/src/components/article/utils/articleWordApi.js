// API functions for article word operations
/**
 * Fetch all words saved by a user
 * @param {string} token - User ID token
 * @returns {Promise<Array>} - Array of all saved words data
 */
export const fetchAllUserWords = async (token) => {
  try {
    const response = await fetch(`http://localhost:8080/api/user-word/words`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}` // ✅ token başlığa eklenir
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user words');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all user words:', error);
    throw error;
  }
};

/**
 * Fetch words saved by a user for a specific article
 * @param {string} token - User ID
 * @param {number} articleId - Article ID
 * @returns {Promise<Array>} - Array of saved words for the specific article
 */
export const fetchArticleWords = async (token, articleId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/user-word/article/${articleId}`,{
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch article words');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching article words:', error);
    throw error;
  }
};

/**
 * Save words to an article
 * @param {string} token - Firebase authentication token
 * @param {number} articleId - Article ID
 * @param {Array} words - Array of word objects with englishId
 * @returns {Promise<boolean>} - Success indicator
 */
export const saveArticleWords = async (token, articleId, words) => {
  try {
    const response = await fetch('http://localhost:8080/api/user-word/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        articleId,
        words,
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save words');
    }
    
    // Check if there's content before trying to parse JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json') && response.headers.get('content-length') !== '0') {
      return await response.json();
    }
    
    // If no content or not JSON, just return success
    return true;
  } catch (error) {
    console.error('Error saving article words:', error);
    throw error;
  }
}; 