import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Menu from './components/Menu';
import Intro from './components/Intro';
import AboutUs from './components/AboutUs';
import Photos from './components/Photos';
import Footer from './components/Footer';
import Admin from './components/Admin';
import Login from './components/Login';
import Services from './components/Service';
import Client from './components/Contact';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('https://localhost:8080/login', { username, password });
      const data = response.data;
      if (data.token) {
        setToken(data.token);
        setIsAuthenticated(true);
      } else {
        throw new Error('Failed to login');
      }
    } catch (error) {
      const message = error.response ? error.response.data : error.message;
      alert(message || message.error);
      console.error('Login error:', message.error);
    }
  };

  const handleLogout = () => {
    setToken('');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Menu isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path="/" element={<><Intro /><AboutUs /><Photos /><Footer /></>} />
          <Route path="/services" element={<><Services /><Footer /></>} />
          <Route path="/clients" element={<><Client /><Footer /></>} />
          <Route path="/login" element={isAuthenticated ? <Navigate replace to="/admin" /> : <Login onLogin={handleLogin} />} />
          <Route path="/admin" element={isAuthenticated ? <Admin token={token} onLogout={handleLogout} /> : <Navigate replace to="/login" />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
