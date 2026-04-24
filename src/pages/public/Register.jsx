import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Briefcase, User, Building, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getEmailError, getPhoneError } from '../../utils/validation.js';

export default function Register() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(() => {
    const roleParam = searchParams.get('role');
    return (roleParam === 'employer' || roleParam === 'seeker') ? roleParam : 'seeker';
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });