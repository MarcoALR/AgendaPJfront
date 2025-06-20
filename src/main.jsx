import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import Home from './pages/Home/';
import Cadastrar from './pages/Home/cadastrar';
import CriarContato from './pages/CriarContato';
import Contatos from "./pages/Contatos";
import Favoritos from './pages/Favoritos';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/criarcontato" element={<CriarContato />} />
        <Route path="/contatos" element={<Contatos />} />
        <Route path="/Favoritos" element={<Favoritos />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
