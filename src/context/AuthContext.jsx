import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mockApplications, setMockApplications] = useState(() => {
    const storedApps = localStorage.getItem('talent_mw_apps');
    return storedApps ? JSON.parse(storedApps) : [];
  });

  const [mockJobs, setMockJobs] = useState(() => {
    const storedJobs = localStorage.getItem('talent_mw_jobs');
    return storedJobs ? JSON.parse(storedJobs) : [];
  });

  const [mockUsers, setMockUsers] = useState(() => {
    const storedUsers = localStorage.getItem('talent_mw_users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  // Initialize from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('talent_mw_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
  }, []);

  // Sync mockApplications to localStorage
  useEffect(() => {
    localStorage.setItem('talent_mw_apps', JSON.stringify(mockApplications));
  }, [mockApplications]);

  useEffect(() => {
    localStorage.setItem('talent_mw_jobs', JSON.stringify(mockJobs));
  }, [mockJobs]);

  useEffect(() => {
    localStorage.setItem('talent_mw_users', JSON.stringify(mockUsers));
  }, [mockUsers]);
  
  const registerUser = (userData) => {
    if (mockUsers.some(u => u.email === userData.email)) {
      return { success: false, message: 'Email already exists' };
    }
    const newUser = {
      id: Math.random().toString(36).substring(7),
      ...userData,
      hasActiveSubscription: false,
      subscriptionPlan: null,
      subscriptionExpiry: null,
      savedJobs: [],
      appliedJobs: [],
      postedJobs: [],
      profilePicture: null
    };
    setMockUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('talent_mw_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const login = (email, password) => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('talent_mw_user', JSON.stringify(foundUser));
      return { success: true, user: foundUser };
    }