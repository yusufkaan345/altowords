import rankData from './ranks.json';

/**
 * Fetches the user's score from the API
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} - The user's score data
 */
export const fetchUserScore = async (token) => {
  try {
    const response = await fetch('http://localhost:8080/api/score/user-score', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user score');
    }
    return await response.json();
    
  } catch (error) {
    console.error('Error fetching user score:', error);
    throw error;
  }
};

/**
 * Fetches all users' scores for the leaderboard
 * @param {string} token - The authentication token
 * @returns {Promise<Array>} - Array of user scores
 */
export const fetchAllScores = async (token) => {
  try {
    const response = await fetch('http://localhost:8080/api/score/all-scores', {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch all scores');
    }
    return await response.json();
    
  } catch (error) {
    console.error('Error fetching all scores:', error);
    throw error;
  }
};

/**
 * Calculates the user's rank and level based on their total score
 * @param {number} totalScore - The user's total score
 * @returns {Object} - The user's rank information
 */
export const calculateUserRank = (totalScore) => {
  const ranks = rankData.ranks;
  let currentRank = ranks[0];
  let currentLevel = currentRank.levels[0];
  let nextLevel = currentRank.levels[1];
  let accumulatedXp = 0;
  let levelProgress = 0;
  
  // Find the current rank and level
  for (let rankIndex = 0; rankIndex < ranks.length; rankIndex++) {
    const rank = ranks[rankIndex];
    
    for (let levelIndex = 0; levelIndex < rank.levels.length; levelIndex++) {
      const level = rank.levels[levelIndex];
      const requiredXp = level.requiredXp;
      
      // Skip the last level of the last rank as it has 0 requiredXp
      if (rankIndex === ranks.length - 1 && levelIndex === rank.levels.length - 1) {
        continue;
      }
      
      if (totalScore < accumulatedXp + requiredXp) {
        currentRank = rank;
        currentLevel = level;
        
        // Determine next level
        if (levelIndex < rank.levels.length - 1) {
          nextLevel = rank.levels[levelIndex + 1];
        } else if (rankIndex < ranks.length - 1) {
          nextLevel = ranks[rankIndex + 1].levels[0];
        } else {
          nextLevel = null; // Max level reached
        }
        
        // Calculate progress to next level
        levelProgress = (totalScore - accumulatedXp) / requiredXp * 100;
        
        return {
          currentRank,
          currentLevel,
          nextLevel,
          totalScore,
          currentXp: totalScore - accumulatedXp,
          requiredXp: requiredXp,
          levelProgress: Math.min(Math.max(0, levelProgress), 100),
          isMaxLevel: false
        };
      }
      
      accumulatedXp += requiredXp;
    }
  }
  
  // If we get here, the user has reached the maximum level
  return {
    currentRank: ranks[ranks.length - 1],
    currentLevel: ranks[ranks.length - 1].levels[ranks[ranks.length - 1].levels.length - 1],
    nextLevel: null,
    totalScore,
    currentXp: totalScore,
    requiredXp: 0,
    levelProgress: 100,
    isMaxLevel: true
  };
}; 