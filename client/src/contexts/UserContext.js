import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

/** Provide global access to user, setUser, admin, and setAdmin field to manage login status */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Initialize user and isAdmin from localStorage when the component mounts
    const storedUser = localStorage.getItem("user");
    const storedIsAdmin = localStorage.getItem("isAdmin");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedIsAdmin) {
      setIsAdmin(JSON.parse(storedIsAdmin));
    }
  }, []);

  useEffect(() => {
    // Store user and isAdmin in localStorage whenever they change
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
  }, [user, isAdmin]);

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin, setIsAdmin }}>
      {children}
    </UserContext.Provider>
  );
};
