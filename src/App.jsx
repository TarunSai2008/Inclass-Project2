import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';

import { ApplicationProvider } from './context/ApplicationContext';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import AddApplication from './pages/AddApplication';
import EditApplication from './pages/EditApplication';
import Analytics from './pages/Analytics';

function AppContent() {
  const location = useLocation();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/applications/new" element={<AddApplication />} />
            <Route path="/applications/:id" element={<EditApplication />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        toastStyle={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '0.875rem',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ApplicationProvider>
      <AppContent />
    </ApplicationProvider>
  );
}
