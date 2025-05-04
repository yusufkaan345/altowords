import { getAuth } from 'firebase/auth';

/**
 * Fetches all articles from the API
 * @returns {Promise<Array>} Array of articles
 */
export const fetchArticles = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/articles/all');

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} | Body: ${text}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

/**
 * Fetches articles that the user has previously read
 * @returns {Promise<Array>} Array of article IDs that have been read
 */
export const fetchReadArticles = async () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
  if (!currentUser) return [];
  
  try {
    const token = await currentUser.getIdToken();
    const response = await fetch(`http://localhost:8080/api/user-word/articles`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      // Extract article IDs into an array
      return data.map(item => item.articleId);
    } else {
      console.error('Failed to fetch read articles');
      return [];
    }
  } catch (error) {
    console.error('Error fetching read articles:', error);
    return [];
  }
}; 