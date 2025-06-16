import React, { useEffect } from "react";
import "./criarcontato.css";

function CriarContato() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/src/services/criarcontato.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo">
          <img
            src="/src/assets/agendapjlogo.png"
            alt="Logo Agenda PJ"
            className="logo-img"
          />
        </div>
        <h2 className="logo">📇 Painel Pj</h2>
        <nav>
          <ul>
            <li>
              <a href="contatos.html">Contatos 👥</a>
            </li>
            <li>
              <a href="favoritos.html">Favoritos ⭐</a>
            </li>
          </ul>
        </nav>
      </aside>

      <div id="banner"></div>

      <main className="main-content">
        <div className="theme-toggle">
          <span>🌗</span>
          <label className="switch">
            <input type="checkbox" id="theme-checkbox" />
            <span className="slider"></span>
          </label>
          <span>🌙</span>
        </div>
        <br />
        <section id="app" className="app-hidden">
          <h2>Contatos</h2>
          <form id="contact-form">
            <input type="text" id="name" placeholder="Nome" required />
            <input type="text" id="phone" placeholder="Telefone" required />
            <input type="email" id="email" placeholder="Email" />
            <select className="categoria" id="category" required>
              <option value="" disabled selected>
                Selecione uma categoria
              </option>
              <option value="Família">👨‍👩‍👧‍👦 Família</option>
              <option value="Trabalho">💼 Trabalho</option>
              <option value="Amigos">🎉 Amigos</option>
              <option value="Outros">📁 Outros</option>
            </select>
            <button type="submit">Adicionar Contato</button>
            <div id="form-error"></div>
            <div id="form-success"></div>
          </form>
          <div id="contacts-container"></div>
        </section>
        <button className="botao-topo-direita" id="logout-button">
          Sair
        </button>
      </main>
    </div>
  );
}

export default CriarContato;
