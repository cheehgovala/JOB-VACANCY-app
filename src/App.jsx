import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SeekerLayout from './components/SeekerLayout';
import EmployerLayout from './components/EmployerLayout';
import SubscriptionGuard from './components/SubscriptionGuard';

import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Subscription from './pages/public/Subscription';
import Payment from './pages/public/Payment';
import PaymentSuccess from './pages/public/PaymentSuccess';

import SeekerDashboard from './pages/seeker/Dashboard';
import CVBuilder from './pages/seeker/CVBuilder';
import JobSearch from './pages/seeker/JobSearch';
import Applications from './pages/seeker/Applications';
import AssessmentsList from './pages/seeker/AssessmentsList';
import Exam from './pages/seeker/Exam';


import EmployerDashboard from './pages/employer/Dashboard';
import JobPosting from './pages/employer/JobPosting';
import Pipeline from './pages/employer/Pipeline';
import AssessmentBuilder from './pages/employer/AssessmentBuilder';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="payment" element={<Payment />} />
        <Route path="payment-success" element={<PaymentSuccess />} />
      </Route>

      <Route element={<SubscriptionGuard />}>
        <Route path="/seeker/exam/:id" element={<Exam />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<SubscriptionGuard />}>
        {/* Standalone CV Builder without Navigation */}
        <Route path="/seeker/cv-builder" element={<CVBuilder />} />
        