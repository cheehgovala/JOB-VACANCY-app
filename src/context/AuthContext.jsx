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