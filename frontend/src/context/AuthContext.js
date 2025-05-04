import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, reload } from 'firebase/auth';

// Create the authentication context
const AuthContext = createContext();

// Hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to check and refresh email verification status
  const checkEmailVerification = async () => {
    if (currentUser && !currentUser.emailVerified) {
      try {
        // Reload user to get fresh data from Firebase
        await reload(currentUser);
        // Set the updated user
        setCurrentUser(auth.currentUser);
        return auth.currentUser.emailVerified;
      } catch (error) {
        console.error('Error reloading user:', error);
        return false;
      }
    }
    return currentUser?.emailVerified || false;
  };

  useEffect(() => {
    // Set up an auth state observer
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Check verification status periodically if user exists but email not verified
    let verificationCheck;
    if (currentUser && !currentUser.emailVerified) {
      verificationCheck = setInterval(checkEmailVerification, 5000); // Check every 5 seconds
    }

    // Clean up the observer and interval on component unmount
    return () => {
      unsubscribe();
      if (verificationCheck) clearInterval(verificationCheck);
    };
  }, [currentUser]);

  // Context value
  const value = {
    currentUser,
    isAuthenticated: !!currentUser && currentUser.emailVerified,
    isEmailVerified: currentUser ? currentUser.emailVerified : false,
    loading,
    checkEmailVerification
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 