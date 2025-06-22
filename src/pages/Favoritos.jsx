import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/favoritos.css";
import agendapjLogo from "./../assets/logoagenda.png";

function Favoritos() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState("light");
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  const loadFavorites = useCallback(() => {
    if (!usuario || !usuario.email) {
      setFavorites([]);
      return;
    }
    const data = localStorage.getItem(`agenda-contatos-${usuario.email}`);
    if (data) {
      const contacts = JSON.parse(data);
      const favs = contacts.filter((c) => c.favorite);
      setFavorites(favs);
    } else {
      setFavorites([]);
    }
  }, [usuario]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("⚠️ Você precisa estar autenticado para acessar esta página.");
      navigate("/");
      return;
    }

    async function validateTokenAndLoadData() {
      try {
        const response = await fetch(
          "https://apiusuariospj.onrender.com/validate-token",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Sessão inválida ou expirada");

        console.log("✅ Sessão válida, usuário autenticado");
        loadFavorites();
      } catch (error) {
        console.error("❌ Erro de autenticação:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("usuarioLogado");
        alert("⚠️ Sessão expirada. Por favor, faça o login.");
        navigate("/");
      }
    }

    validateTokenAndLoadData();

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
      setTheme("dark");
    }
  }, [navigate, loadFavorites]);

  const handleThemeToggle = () => {
    const isDark = theme === "light";
    setTheme(isDark ? "dark" : "light");
    document.body.classList.toggle("dark-theme", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Tem certeza que quer sair da sua conta?"
    );
    if (confirmLogout) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("usuarioLogado");
      console.log("Logout realizado");
      alert("Você saiu da sua conta.");
      navigate("/");
    }
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo">
          <img src={agendapjLogo} alt="Logo Agenda PJ" className="logo-img" />
        </div>
        <h2 className="logo">⭐Favoritos PJ</h2>
        <nav>
          <ul>
            <li>
              <a href="/criarcontato">Painel 📇</a>
            </li>
            <li>
              <a href="/contatos">Contatos 👥</a>
            </li>
          </ul>
          <ul>
            <br />
            <li>
              <a href="/familia">👨‍👩‍👧 Família</a>
            </li>
            <li>
              <a href="/trabalho">💼 Trabalho</a>
            </li>
            <li>
              <a href="/amigos">🎉 Amigos</a>
            </li>
            <li>
              <a href="/outros">📂 Outros</a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="theme-toggle">
          <span>🌗</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={handleThemeToggle}
            />
            <span className="slider"></span>
          </label>
          <span>🌙</span>
        </div>

        <br />
        <h2>Contatos Favoritos</h2>
        <br />

        <div id="contacts-container">
          {favorites.length === 0 ? (
            <p>Nenhum contato favorito ainda.</p>
          ) : (
            favorites.map((contact, index) => (
              <div className="contact-card" key={index}>
                <h3>{contact.name}</h3>
                <p>📞 {contact.phone}</p>
                <p>📧 {contact.email || "—"}</p>
                <p>
                  📁 Categoria: <strong>{contact.category || "—"}</strong>
                </p>
                <p>⭐ Favorito</p>
                <a
                  href={`https://wa.me/${contact.phone
                    .replace(/\D/g, "")
                    .replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-button"
                >
                  🟢 WhatsApp
                </a>
              </div>
            ))
          )}
        </div>
      </main>

      <div className="usuario-info">
        <span className="usuario-logado">
          👤 {usuario?.name ? usuario.name : "Usuário"}
        </span>
        <button className="botao-topo-direita" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  );
}

export default Favoritos;
