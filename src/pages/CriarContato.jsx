import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/criarcontato.css";
import agendapjLogo from "../assets/logoagenda.png";
import axios from "axios";

function CriarContato() {
  const navigate = useNavigate();
  const API_URL = "https://apiusuariospj.onrender.com";

  const [themeDark, setThemeDark] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [contacts, setContacts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [usuarioLogado, setUsuarioLogado] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("⚠️ Você precisa estar autenticado para acessar esta página.");
      navigate("/");
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios.get(`${API_URL}/usuarios`)
      .then(() => {
        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (usuario?.name) setUsuarioLogado(usuario.name);
        if (usuario?.email) {
          const savedContacts = JSON.parse(localStorage.getItem(`agenda-contatos-${usuario.email}`)) || [];
          setContacts(savedContacts);
        }
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") setThemeDark(true);
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("usuarioLogado");
        alert("⚠️ Sessão expirada. Faça login novamente.");
        navigate("/");
      });
  }, [navigate]);

  const saveContacts = (newContacts) => {
    setContacts(newContacts);
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (usuario?.email) {
      localStorage.setItem(`agenda-contatos-${usuario.email}`, JSON.stringify(newContacts));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setErrorMsg("");
    setSuccessMsg("");

    if (name.trim().length < 2) {
      setErrorMsg("⚠️ Nome deve ter pelo menos 2 letras.");
      return;
    }

    if (!phoneRegex.test(phone.trim())) {
      setErrorMsg("⚠️ Telefone inválido. Use (32) 99999-9999.");
      return;
    }

    if (email && !emailRegex.test(email.trim())) {
      setErrorMsg("⚠️ Email inválido.");
      return;
    }

    if (!category) {
      setErrorMsg("⚠️ Selecione uma categoria.");
      return;
    }

    const telefoneDuplicado = contacts.some((c) => c.phone === phone && c.id !== editingId);
    if (telefoneDuplicado) {
      setErrorMsg("⚠️ Este telefone já está cadastrado.");
      return;
    }

    const emailDuplicado = email && contacts.some((c) => c.email === email && c.id !== editingId);
    if (emailDuplicado) {
      setErrorMsg("⚠️ Este email já está cadastrado.");
      return;
    }

    const novoContato = {
      id: Date.now(),
      name,
      phone,
      email,
      category,
      favorite: false,
    };

    if (editingId) {
      const updatedContacts = contacts.map((c) =>
        c.id === editingId ? { ...c, name, phone, email, category } : c
      );
      saveContacts(updatedContacts);
      setSuccessMsg("✅ Contato editado com sucesso!");
      setEditingId(null);
    } else {
      const updatedContacts = [...contacts, novoContato];
      saveContacts(updatedContacts);
      setSuccessMsg("✅ Contato salvo com sucesso!");
    }

    setName("");
    setPhone("");
    setEmail("");
    setCategory("");

    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleEdit = (id) => {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      setName(contact.name);
      setPhone(contact.phone);
      setEmail(contact.email);
      setCategory(contact.category);
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    const updatedContacts = contacts.filter((c) => c.id !== id);
    saveContacts(updatedContacts);
  };

  const toggleFavorite = (id) => {
    const updatedContacts = contacts.map((c) =>
      c.id === id ? { ...c, favorite: !c.favorite } : c
    );
    saveContacts(updatedContacts);
  };

  const handleThemeToggle = () => {
    const newThemeDark = !themeDark;
    setThemeDark(newThemeDark);
    localStorage.setItem("theme", newThemeDark ? "dark" : "light");
  };

  const logout = () => {
    const confirmLogout = window.confirm("Tem certeza que quer sair?");
    if (confirmLogout) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("usuarioLogado");
      navigate("/");
    }
  };

  return (
    <div className={`container ${themeDark ? "dark-theme" : ""}`}>
      <aside className="sidebar">
        <div className="logo">
          <img src={agendapjLogo} alt="Logo Agenda PJ" className="logo-img" />
        </div>
        <h2 className="logo">📇 Painel PJ</h2>
        <nav>
          <ul>
            <li><a href="/contatos">👥 Contatos</a></li>
            <li><a href="/favoritos">⭐ Favoritos</a></li>
          </ul>
          <ul>
            <li><a href="/familia">👨‍👩‍👧 Família</a></li>
            <li><a href="/trabalho">💼 Trabalho</a></li>
            <li><a href="/amigos">🎉 Amigos</a></li>
            <li><a href="/outros">📂 Outros</a></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="top-bar">
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

          <div className="usuario-info">
            <span className="usuario-logado">👤 {usuarioLogado}</span>
            <button className="botao-topo-direita" onClick={logout}>Sair</button>
          </div>
        </div>

        <section id="app">
          <h2>Contatos</h2>
          <form onSubmit={handleSubmit} id="contact-form">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" required />
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefone" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="" disabled>Selecione uma categoria</option>
              <option value="Família">👨‍👩‍👧‍👦 Família</option>
              <option value="Trabalho">💼 Trabalho</option>
              <option value="Amigos">🎉 Amigos</option>
              <option value="Outros">📁 Outros</option>
            </select>
            <button type="submit">{editingId ? "Salvar Edição" : "Adicionar Contato"}</button>
            {errorMsg && <div id="form-error">{errorMsg}</div>}
            {successMsg && <div id="form-success">{successMsg}</div>}
          </form>

          <div id="contacts-container">
            {contacts.map((contact) => {
              const formattedPhone = "55" + contact.phone.replace(/\D/g, "").replace(/^0/, "");
              return (
                <div key={contact.id} className="contact-card">
                  <h3>{contact.name}</h3>
                  <p>📞 {contact.phone}</p>
                  <p>📧 {contact.email || "—"}</p>
                  <p>📁 Categoria: <strong>{contact.category || "—"}</strong></p>
                  <button onClick={() => toggleFavorite(contact.id)}>
                    {contact.favorite ? "⭐ Favorito" : "☆ Favorito"}
                  </button>
                  <button onClick={() => handleEdit(contact.id)}>✏️ Editar</button>
                  <button onClick={() => handleDelete(contact.id)}>🗑️ Excluir</button>
                  <a
                    href={`https://wa.me/${formattedPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-button"
                  >
                    <span className="whatsapp-icon">🟢</span> WhatsApp
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default CriarContato;
