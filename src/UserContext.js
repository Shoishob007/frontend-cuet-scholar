import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(); // Create the context

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); // Custom hook to access the user context

export default UserContext;
