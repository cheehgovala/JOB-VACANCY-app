import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('talent_mw_token');
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data.user || res.data); 
        } catch (e) {
          console.error('Failed to fetch user profile', e);
          localStorage.removeItem('talent_mw_token');
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const registerUser = async (userData) => {
    try {
      const payload = {
        name: userData.name || (userData.firstName + ' ' + userData.lastName),
        email: userData.email,
        phone: userData.phone || '0000000000',
        password: userData.password,
        role: userData.role || 'seeker'
      };
      const res = await api.post('/auth/register', payload);
      // Backend returns requireOTP and email if OTP is sent
      if (res.data.token) {
        localStorage.setItem('talent_mw_token', res.data.token);
        setUser(res.data.user || res.data);
      }
      return { 
        success: true, 
        user: res.data.user || res.data, 
        requireOTP: res.data.requireOTP, 
        email: res.data.email,
        message: res.data.message 
      };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Registration failed' };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      if (res.data.token) {
        localStorage.setItem('talent_mw_token', res.data.token);
        setUser(res.data.user || res.data);
        return { success: true, user: res.data.user || res.data };
      }
      return { success: false, message: 'Invalid OTP.' };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Verification failed.' };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('talent_mw_token', res.data.token);
        setUser(res.data.user || res.data);
        return { success: true, user: res.data.user || res.data };
      }
      return { success: false, message: 'Invalid credential' };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Invalid credential' };
    }
  };
  
  const forgotPassword = async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Failed to send OTP.' };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const res = await api.post('/auth/reset-password', { email, otp, newPassword });
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Failed to reset password.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('talent_mw_token');
  };

  const updateSubscription = async (plan, durationDays) => {
    if (!user) return;
    try {
      const res = await api.put('/auth/subscription', { plan, durationDays });
      setUser(res.data.user || res.data);
    } catch (error) {
      console.error('Subscription update failed', error);
    }
  };

  const updateSeekerProfile = async (profileData, completeness) => {
    if (!user) return;
    try {
      const payload = { ...profileData, completeness };
      const res = await api.put('/auth/profile', payload);
      setUser(res.data.user || res.data);
    } catch (error) {
      console.error('Profile update failed', error);
    }
  };

  const updateProfilePicture = async (base64Image) => {
     try {
         const res = await fetch(base64Image);
         const blob = await res.blob();
         const formData = new FormData();
         formData.append('image', blob, 'profile.jpg');
         
         const response = await api.post('/auth/profile-picture', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         });
         setUser(response.data.user);
     } catch (error) {
         console.error('Profile picture update failed', error);
     }
  };

  const saveJob = async (jobId) => {
      try {
          await api.post(`/jobs/${jobId}/save`);
          const res = await api.get('/auth/profile');
          setUser(res.data.user || res.data);
      } catch (error) {
          console.error('Failed to save job', error);
      }
  };

  const applyToJob = async (job) => {
      try {
          const jobId = job._id || job.id;
          const res = await api.post(`/applications/${jobId}`);
          return { success: true, message: 'Application submitted perfectly' };
      } catch (error) {
          return { success: false, message: error.response?.data?.error || 'Failed to apply' };
      }
  };

  const publishJob = async (jobData) => {
      try {
          const response = await api.post('/jobs', jobData);
          return { success: true, job: response.data };
      } catch (error) {
          console.error('Failed to publish job', error);
          return { success: false, message: error.response?.data?.error || 'Failed to publish job' };
      }
  };

  const updateJob = async (jobId, jobData) => {
      try {
          const response = await api.put(`/jobs/${jobId}`, jobData);
          return { success: true, job: response.data };
      } catch (error) {
          console.error('Failed to update job', error);
          return { success: false, message: error.response?.data?.error || 'Failed to update job' };
      }
  };

  const deleteJob = async (jobId) => {
      try {
          await api.delete(`/jobs/${jobId}`);
          return { success: true };
      } catch (error) {
          console.error('Failed to delete job', error);
          return { success: false, message: error.response?.data?.error || 'Failed to delete job' };
      }
  };

  return (
    <AuthContext.Provider value={{ 
        user, setUser, login, logout, registerUser, verifyOTP, updateSubscription, 
        updateSeekerProfile, saveJob, applyToJob, publishJob, updateJob, deleteJob, updateProfilePicture, loading,
        forgotPassword, resetPassword
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
