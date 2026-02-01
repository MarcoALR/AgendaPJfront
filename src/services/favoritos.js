document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("⚠️ Você precisa estar autenticado para acessar esta página.");
    window.location.replace("/");
    return;
  }

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

    if (!response.ok) {
      throw new Error("Sessão inválida ou expirada");
    }

    console.log("✅ Sessão válida, usuário autenticado");
  } catch (error) {
    console.error("❌ Erro de autenticação:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("usuarioLogado");
    alert("⚠️ Sessão expirada. Por favor, faça o login.");
    window.location.replace("/");
    return;
  }

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const usuarioLogadoEl = document.querySelector(".usuario-logado");

  if (usuario && usuario.name && usuarioLogadoEl) {
    usuarioLogadoEl.textContent = `👤 ${usuario.name}`;
  }

  const container = document.getElementById("favorites-container");
  const themeToggle = document.getElementById("theme-checkbox");

  function loadFavorites() {
    if (!usuario || !usuario.email) {
      container.innerHTML = "<p>⚠️ Não foi possível carregar os favoritos.</p>";
      return;
    }

    const data = localStorage.getItem(`agenda-contatos-${usuario.email}`);
    if (data) {
      const contacts = JSON.parse(data);
      const favorites = contacts.filter((c) => c.favorite);

      if (favorites.length === 0) {
        container.innerHTML = "<p>Nenhum contato favorito ainda.</p>";
        return;
      }

      favorites.forEach((contact) => {
        const card = document.createElement("div");
        card.classList.add("contact-card");

        card.innerHTML = `
          <h3>${contact.name}</h3>
          <p>📞 ${contact.phone}</p>
          <p>📧 ${contact.email || "—"}</p>
          <p>📁 Categoria: <strong>${contact.category || "—"}</strong></p>
          <p>⭐ Favorito</p>
        `;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = "<p>Nenhum contato favorito ainda.</p>";
    }
  }

  loadFavorites();

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    if (themeToggle) themeToggle.checked = true;
  }

  if (themeToggle) {
    themeToggle.addEventListener("change", () => {
      const isDark = themeToggle.checked;
      document.body.classList.toggle("dark-theme", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  const logoutBtn = document.getElementById("logout-button");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      const confirmLogout = window.confirm(
        "Tem certeza que quer sair da sua conta?"
      );
      if (confirmLogout) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("usuarioLogado");
        console.log("Logout realizado");
        alert("Você saiu da sua conta.");
        window.location.replace("/");
      }
    });
  }
});
