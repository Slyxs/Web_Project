import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Contacto from './Contacto.jsx';
import Login from './Login.jsx'; // Importing Login component
import Register from './Register.jsx';
import './App.css'; // Assuming global styles are in App.css or similar

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} /> {/* Route for Login */}
        <Route path="/register" element={<Register />} /> {/* Route for Register */}
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
