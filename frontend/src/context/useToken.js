import { useAuth } from './AuthContext';

/**
 * Custom hook to get the authentication token from the current user
 * @returns {Function} getToken - Function to get the current token
 */
export const useToken = () => {
  const { currentUser } = useAuth();
  
  /**
   * Get the current user's ID token
   * @param {boolean} forceRefresh - Whether to force refresh the token
   * @returns {Promise<string|null>} The ID token or null if no user
   */
  const getToken = async (forceRefresh = false) => {
    if (!currentUser) return null;
    try {
      return await currentUser.getIdToken(forceRefresh);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };
  
  return { getToken };
}; 