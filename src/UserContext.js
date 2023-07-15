import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from "firebase/auth";

const UserContext = createContext(); // Create the context

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state
  const [isAdmin, setIsAdmin] = useState(false); // Admin state

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    const checkAdmin = async () => {
      if (user && user.email) {
        const db = getFirestore();
        const adminDocRef = doc(db, "admins", user.email);
        const adminDocSnap = await getDoc(adminDocRef);
        setIsAdmin(adminDocSnap ? true : false);
      }
    };

    checkAdmin();

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); // Custom hook to access the user context

export default UserContext;
