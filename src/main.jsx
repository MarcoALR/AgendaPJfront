import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Cadastrar from './pages/Home/cadastrar';
import CriarContato from './pages/Home/criarcontato'; // Novo import para o CriarContato

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/criarcontato" element={<CriarContato />} /> {/* Rota do CriarContato */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
