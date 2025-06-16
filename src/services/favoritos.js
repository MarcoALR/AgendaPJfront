document.addEventListener("DOMContentLoaded", function () {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
    alert("⚠️ Você precisa estar logado para acessar esta página.");
    window.location.replace("http://localhost:5173");
  }

  const logoutBtn = document.getElementById("logout-button");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      const usuario = localStorage.getItem("usuarioLogado");

      if (usuario) {
        localStorage.removeItem("usuarioLogado");
        console.log("✅ Logout realizado");
        alert("Você saiu da sua conta.");
        window.location.replace("http://localhost:5173");
      } else {
        alert("⚠️ Nenhum usuário estava logado.");
      }
    });
  }
});

    const container = document.getElementById("favorites-container");
    const themeToggle = document.getElementById("theme-checkbox");

    function loadFavorites() {
      const data = localStorage.getItem("agenda-contatos");
      if (data) {
        const contacts = JSON.parse(data);
        const favorites = contacts.filter(c => c.favorite);

        if (favorites.length === 0) {
          container.innerHTML = "<p>Nenhum contato favorito ainda.</p>";
          return;
        }

        favorites.forEach(contact => {
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
      }
    }

    window.addEventListener("DOMContentLoaded", () => {
      loadFavorites();
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        if (themeToggle) themeToggle.checked = true;
      }
    });


    if (themeToggle) {
      themeToggle.addEventListener("change", () => {
        const isDark = themeToggle.checked;
        document.body.classList.toggle("dark-theme", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
      });
    }