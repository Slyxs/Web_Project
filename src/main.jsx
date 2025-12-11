import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Contacto from './Contacto.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Perfil from './Perfil.jsx';
import PerfilDoctor from './Perfil_Doctor.jsx';
import BuscarDoctores from './BuscarDoctores.jsx';
import Chatbot from './Chatbot.jsx';

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
        <Route path="/perfil-doctor" element={<PerfilDoctor />} />
        <Route path="/buscar-doctores" element={<BuscarDoctores />} />
        <Route path="/chatbot" element={<Chatbot />} />
        {/* Rutas de prueba */}
        <Route path="/appcopy" element={<AppCOPIA />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
