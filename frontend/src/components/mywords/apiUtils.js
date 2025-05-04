/**
 * Fetches all words saved by a user
 * @param {string} token - The Firebase authentication token
 * @returns {Promise<Array>} - Array of article data with words
 */
export const fetchUserWords = async (token) => {
  try {
    const response = await fetch(`http://localhost:8080/api/user-word/words`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user words');
    }
    const data = await response.json();
    
    // Sort articles by ID in descending order (newest first)
    return data.sort((a, b) => b.articleId - a.articleId);
  } catch (error) {
    console.error('Error fetching user words:', error);
    throw error;
  }
};

/**
 * Deletes a user word using the API
 * @param {string} token - The Firebase authentication token
 * @param {number} articleId - The article ID
 * @param {number} englishId - The English word ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteUserWord = async (token, articleId, englishId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/user-word/delete/${articleId}/${englishId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete word');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting word:', error);
    throw error;
  }
};

/**
 * Extracts unique article IDs from word data
 * @param {Array} wordData - The array of article data with words
 * @returns {Array} - Array of article objects with id and title
 */
export const extractArticles = (wordData) => {
  const articles = [];
  
  wordData.forEach(item => {
    if (!articles.some(article => article.id === item.articleId)) {
      articles.push({
        id: item.articleId,
        title: item.articleTitle || `Article ${item.articleId}`,
        difficulty: item.difficulty || "Unknown Difficulty"
      });
    }
  });
  
  return articles;
};

/**
 * Filters word data based on search term and articleId
 * @param {Array} wordData - The array of article data with words
 * @param {string} searchTerm - Text to search for in words or translations
 * @param {string|number} articleId - Specific article ID to filter by (or 'all')
 * @returns {Array} - Filtered words with article metadata
 */
export const filterWordData = (wordData, searchTerm, articleId) => {
  let filteredData = [];
  
  // First filter by article if needed
  const articleFiltered = articleId === 'all' 
    ? wordData 
    : wordData.filter(item => item.articleId.toString() === articleId.toString());
  
  // Extract all words with article metadata
  articleFiltered.forEach(article => {
    article.words.forEach(word => {
      filteredData.push({
        ...word,
        articleId: article.articleId,
        articleTitle: article.articleTitle,
        difficulty: article.difficulty
      });
    });
  });
  
  // Then filter by search term if provided
  if (searchTerm.trim()) {
    const lowercaseTerm = searchTerm.toLowerCase();
    filteredData = filteredData.filter(word => {
      // Check if word matches
      if (word.word.toLowerCase().includes(lowercaseTerm)) return true;
      
      // Check if any translation matches
      return word.translates.some(translate => 
        translate.turkish.toLowerCase().includes(lowercaseTerm)
      );
    });
  }
  
  return filteredData;
}; 