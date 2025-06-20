import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Home from "./pages/Home/";
import Cadastrar from "./pages/Home/cadastrar";
import CriarContato from "./pages/CriarContato";
import Contatos from "./pages/Contatos";
import Favoritos from "./pages/Favoritos";
import Amigos from "./pages/Amigos";
import Familia from "./pages/Familia";
import Outros from "./pages/Outros";
import Trabalho from "./pages/Trabalho";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/criarcontato" element={<CriarContato />} />
        <Route path="/contatos" element={<Contatos />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/amigos" element={<Amigos />} />
        <Route path="/familia" element={<Familia />} />
        <Route path="/outros" element={<Outros />} />
        <Route path="/trabalho" element={<Trabalho />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
