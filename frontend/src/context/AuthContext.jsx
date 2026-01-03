import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('flawender_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login logic
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'demo@flawender.com' && password === 'password') {
           const userData = { id: '1', name: 'Demo User', email, avatar: 'https://ui-avatars.com/api/?name=Demo+User' };
           setUser(userData);
           localStorage.setItem('flawender_user', JSON.stringify(userData));
           resolve(userData);
        } else {
            // Allow any login for demo purposes if not specific demo user
            const userData = { id: Date.now().toString(), name: email.split('@')[0], email, avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}` };
            setUser(userData);
            localStorage.setItem('flawender_user', JSON.stringify(userData));
            resolve(userData);
        }
      }, 800);
    });
  };

  const signup = async (name, email, password) => {
      // Mock signup logic
      return new Promise((resolve) => {
          setTimeout(() => {
              const userData = { id: Date.now().toString(), name, email, avatar: `https://ui-avatars.com/api/?name=${name}` };
              setUser(userData);
              localStorage.setItem('flawender_user', JSON.stringify(userData));
              resolve(userData);
          }, 800);
      });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('flawender_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
