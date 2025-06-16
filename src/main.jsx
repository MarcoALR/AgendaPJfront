import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Criarcontato from './criarcontato.html';
import Cadastrar from './pages/Home/cadastrar';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/criarcontato" element={<Criarcontato />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
