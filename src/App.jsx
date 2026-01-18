import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './components/profile/Profile';
import Discover from './components/discover/Discover';
import Matches from './pages/matches/Matches';
import Messages from './components/messages/Messages';
import FeedbackButton from './components/feedback/FeedbackButton';
import FeedbackAdmin from './pages/admin/FeedbackAdmin';
import BetaBanner from './components/common/BetaBanner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/discover" />;
};

function App() {
  const { isAuthenticated } = useAuthStore();
  return (
    <Router>
      <BetaBanner />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        <Route
          path="/discover"
          element={
            <ProtectedRoute>
              <Discover />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
         <Route
        path="/admin/feedbacks"
        element={
          <ProtectedRoute>
            <FeedbackAdmin />
          </ProtectedRoute>
        }
      />

        <Route path="/" element={<Navigate to="/discover" />} />
        <Route path="*" element={<Navigate to="/discover" />} />
      </Routes>
       {isAuthenticated && <FeedbackButton />}
    </Router>
  );
}

export default App;