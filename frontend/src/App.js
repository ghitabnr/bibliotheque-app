import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authUtils } from './services/auth';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Livres from './pages/Livres';
import Membres from './pages/Membres';
import Emprunts from './pages/Emprunts';
import './App.css';

// Composant de route protégée
const ProtectedRoute = ({ children }) => {
  if (!authUtils.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Header />
      <Navbar />
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};

// Composant de route publique
const PublicRoute = ({ children }) => {
  if (authUtils.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Routes publiques */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Routes protégées */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/livres" 
          element={
            <ProtectedRoute>
              <Livres />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/membres" 
          element={
            <ProtectedRoute>
              <Membres />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/emprunts" 
          element={
            <ProtectedRoute>
              <Emprunts />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirections par défaut */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;