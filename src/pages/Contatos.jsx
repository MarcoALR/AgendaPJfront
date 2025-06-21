import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/favoritos.css";
import agendapjLogo from "./../assets/agendapjlogo.png";

function Contatos() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("az");
  const [themeDark, setThemeDark] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("⚠️ Você precisa estar autenticado para acessar esta página.");
      navigate("/");
      return;
    }

    fetch("https://apiusuariospj.onrender.com/validate-token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Sessão inválida ou expirada");
        console.log("✅ Sessão válida, usuário autenticado");
      })
      .catch((error) => {
        console.error("❌ Erro de autenticação:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("usuarioLogado");
        alert("⚠️ Sessão expirada. Por favor, faça o login.");
        navigate("/");
      });

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setThemeDark(true);
    }

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (usuario && usuario.name) {
      setUsuarioLogado(usuario.name);
    }

    loadContacts();
  }, [navigate]);

  const loadContacts = () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario || !usuario.email) {
      setContacts([]);
      return;
    }

    const data = localStorage.getItem(`agenda-contatos-${usuario.email}`);
    if (data) {
      setContacts(JSON.parse(data));
    } else {
      setContacts([]);
    }
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

  const filteredContacts = contacts
    .filter((c) => c.name.toLowerCase().includes(searchName.toLowerCase()))
    .filter((c) => (filterCategory ? c.category === filterCategory : true))
    .sort((a, b) =>
      sortOrder === "az"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  const handleThemeToggle = () => {
    const newTheme = !themeDark;
    setThemeDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div className={`container ${themeDark ? "dark-theme" : ""}`}>
      <aside className="sidebar">
        <div className="logo">
          <img src={agendapjLogo} alt="Logo Agenda PJ" className="logo-img" />
        </div>
        <h2 className="logo">👥 Contatos PJ</h2>
        <nav>
          <ul>
            <li>
              <a href="/criarcontato">Painel 📇</a>
            </li>
            <li>
              <a href="/favoritos">Favoritos ⭐</a>
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
              <a href="/amigos">👫 Amigos</a>
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
              checked={themeDark}
              onChange={handleThemeToggle}
            />
            <span className="slider"></span>
          </label>
          <span>🌙</span>
        </div>

        <h2>Todos os Contatos</h2>
        <br />

        <div className="filters">
          <input
            type="text"
            placeholder="🔍 Buscar por nome"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Filtrar por categoria</option>
            <option value="Família">Família</option>
            <option value="Trabalho">Trabalho</option>
            <option value="Amigos">Amigos</option>
            <option value="Outros">Outros</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="az">Ordenar: A → Z</option>
            <option value="za">Ordenar: Z → A</option>
          </select>
        </div>

        <div className="contacts-container" id="all-contacts-container">
          {filteredContacts.length === 0 ? (
            <p>Nenhum contato encontrado.</p>
          ) : (
            filteredContacts.map((contact) => (
              <div key={contact.id} className="contact-card">
                <h3>{contact.name}</h3>
                <p>📞 {contact.phone}</p>
                <p>📧 {contact.email || "—"}</p>
                <p>
                  📁 Categoria: <strong>{contact.category || "—"}</strong>
                </p>
                <p>{contact.favorite ? "⭐ Favorito" : ""}</p>
              </div>
            ))
          )}
        </div>
      </main>

      <div className="usuario-info">
        <span className="usuario-logado">👤 {usuarioLogado}</span>
        <button
          className="botao-topo-direita"
          id="logout-button"
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>
    </div>
  );
}

export default Contatos;
