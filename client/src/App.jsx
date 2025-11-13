import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Interfaces from './pages/Interfaces';
import Locations from './pages/Locations';
import UsersPage from './pages/UsersPage';
import Maintenance from './pages/Maintenance';
import Setting from './pages/Setting';
import Analytics from './pages/Analytics';
import ChangePasswordFirstLogin from '@/components/ChangePasswordFirstLogin';
import './App.css';
import { Toaster } from 'sonner';
import { User, Users } from 'lucide-react';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationToast from './components/NotificationToast';
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
        <NotificationToast />
        <Toaster position="top-right" richColors />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/change-password-first-login" element={<ChangePasswordFirstLogin />} />
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="interfaces" element={
                <ProtectedRoute requiredPermission="interface:read">
                  <Interfaces />
                </ProtectedRoute>
              } />
              <Route path="locations" element={
                <ProtectedRoute requiredPermission="location:read">
                  <Locations />
                </ProtectedRoute>
              } />
              <Route path="maintenance" element={
                <ProtectedRoute requiredPermission="maintenance:read">
                  <Maintenance />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute requiredPermission="user:read">
                  <UsersPage/>
                </ProtectedRoute>
              } />
              <Route path="analytics" element={
                <ProtectedRoute requiredPermission="reports:read">
                  <Analytics/>
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute requiredPermission="settings:read">
                  <Setting/>
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
    
  );
}

export default App;

