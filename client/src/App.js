import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount.
  useEffect(() => {
    axios
      .get('http://localhost:5000/auth/current', { withCredentials: true })
      .then((response) => {
        if (response.data.user) {
          setIsAuthenticated(true);
        }
      })
      .catch((err) => {
        console.error('Authentication check error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App; 