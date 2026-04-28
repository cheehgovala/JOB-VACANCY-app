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
