// AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to hold current user
  
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      await GoogleSignin.signOut();
      setUser(null); // Clear user state upon logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
