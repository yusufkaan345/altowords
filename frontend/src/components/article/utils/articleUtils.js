import nlp from 'compromise';

/**
 * Calculate the position for the word details popup
 * @param {DOMRect} rect - The bounding rectangle of the clicked word
 * @param {DOMRect} containerRect - The bounding rectangle of the container
 * @returns {Object} - The x and y coordinates for the popup
 */
export const calculatePopupPosition = (rect, containerRect) => {
  // Default position (30px below the word)
  let x = rect.left - containerRect.left;
  let y = rect.top - containerRect.top + 30;

  // Check if popup would go off the right edge
  const popupWidth = 250; // Approximate width of popup
  if (x + popupWidth > containerRect.width - 20) {
    x = containerRect.width - popupWidth - 20;
  }

  // Check if popup would go off the bottom edge
  const popupHeight = 250; // Approximate height of popup
  if (y + popupHeight > containerRect.height - 40) {
    // Position above the word instead
    y = rect.top - containerRect.top - popupHeight - 100;

    // If that would go off the top, position at the bottom of the container
    if (y < 20) {
      y = containerRect.height - popupHeight - 20;
    }
  }

  return { x, y };
};

/**
 * Get the stemmed (root) form of a word
 * @param {string} word - The word to get the stem for
 * @param {Object} stemCache - Cache object for stemmed words
 * @returns {string} - The stemmed word
 */
export const getStemmedWord = (word, stemCache = {}) => {
  // Check if word is valid
  if (!word || word.length < 2) {
    return word;
  }

  const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-’_`~()'"?]/g, '').toLowerCase();
  
  // Check cache first
  if (stemCache[cleanWord]) {
    return stemCache[cleanWord];
  }
  
  // Use compromise to get the root form
  const doc = nlp(cleanWord);
  let lemmatized = cleanWord;
  
  // Try to get the root form of the word
  if (doc.has('#Verb')) {
    lemmatized = doc.verbs().toInfinitive().out('text');
  } else if (doc.has('#Noun')) {
    lemmatized = doc.nouns().toSingular().out('text');
  } else if (doc.has('#Adjective')) {
    lemmatized = doc.adjectives().out('root');
  }
  
  return lemmatized;
};

/**
 * Process a word by cleaning it and getting its stemmed form
 * @param {string} word - The word to process
 * @param {Object} stemCache - Cache object for stemmed words
 * @returns {Object} - Object with original and stemmed forms
 */
export const processWord = (word, stemCache = {}) => {
  if (!word || word.length < 2) {
    return { original: word, stemmed: word };
  }

  try {
    const cleanWord = word.replace(/[.,“\/#!$%\^&\*;:{}=\-_`~()'"”?]/g, '').toLowerCase();
    const lemmatized = getStemmedWord(cleanWord, stemCache);
    
    return { original: cleanWord, stemmed: lemmatized };
  } catch (error) {
    console.error('Error processing word:', error);
    return { original: word, stemmed: word };
  }
};

/**
 * Fetch translation from API for a selected word
 * @param {string} word - The word to translate
 * @param {Object} stemCache - Cache for stemmed words
 * @returns {Promise<Object>} - The translation data
 */
export const fetchWordTranslation = async (word, stemCache = {}) => {
  try {
    // Get the lemmatized form to send to the API
    const lemmatizedWord = getStemmedWord(word, stemCache);
    
    const response = await fetch(`http://localhost:8080/api/translate/${lemmatizedWord}`);
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        // Limit to first 5 translations
        const limitedData = data.slice(0, 5);
        
        // Return the data for processing
        return {
          translations: limitedData.map(item => item.turkish.toLowerCase()),
          englishId: limitedData[0].englishId,
          success: true
        };
      }
    }
    
    // Return empty result if no data or error
    return { translations: [], englishId: null, success: false };
  } catch (error) {
    console.error('Error fetching translation:', error);
    return { translations: [], englishId: null, success: false, error };
  }
}; 

