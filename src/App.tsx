import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { Landing } from './pages/Landing.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { Wallet } from './pages/Wallet.tsx';
import { Plans } from './pages/Plans.tsx';
import { History } from './pages/History.tsx';
import { Profile } from './pages/Profile.tsx';
import { MyInvestments } from './pages/MyInvestments.tsx';
import { Referrals } from './pages/Referrals.tsx';
import { Notifications } from './pages/Notifications.tsx';
import { Security } from './pages/Security.tsx';
import { Settings } from './pages/Settings.tsx';
import { Support } from './pages/Support.tsx';
import { ComingSoon } from './pages/ComingSoon.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';

import { AdminDashboard } from './pages/Admin/Dashboard.tsx';
import { UserManagement } from './pages/Admin/Users.tsx';
import { TransactionApprovals } from './pages/Admin/Transactions.tsx';
import { AdminLogs } from './pages/Admin/Logs.tsx';
import { AdminPlans } from './pages/Admin/Plans.tsx';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/" />;
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user || !user.isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page - Public Route */}
          <Route path="/" element={<Landing />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard Routes - Protected */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="wallet" element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            } />
            <Route path="plans" element={
              <ProtectedRoute>
                <Plans />
              </ProtectedRoute>
            } />
            <Route path="my-investments" element={
              <ProtectedRoute>
                <MyInvestments />
              </ProtectedRoute>
            } />
            <Route path="history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />
            <Route path="referrals" element={
              <ProtectedRoute>
                <Referrals />
              </ProtectedRoute>
            } />
            <Route path="notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="security" element={
              <ProtectedRoute>
                <Security />
              </ProtectedRoute>
            } />
            <Route path="support" element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="admin/users" element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } />
            <Route path="admin/transactions" element={
              <AdminRoute>
                <TransactionApprovals />
              </AdminRoute>
            } />
            <Route path="admin/logs" element={
              <AdminRoute>
                <AdminLogs />
              </AdminRoute>
            } />
            <Route path="admin/plans" element={
              <AdminRoute>
                <AdminPlans />
              </AdminRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
