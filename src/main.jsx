import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Contacto from './Contacto.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Perfil from './Perfil.jsx';

// Para testeos
import AppCOPIA from './App copy.jsx';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/Web_Project/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Perfil />} />
        {/* Rutas de prueba */}
        <Route path="/appcopy" element={<AppCOPIA />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
