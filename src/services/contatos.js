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

    const container = document.getElementById("all-contacts-container");
    const searchInput = document.getElementById("search-name");
    const filterCategory = document.getElementById("filter-category");
    const sortSelect = document.getElementById("sort-az");
    const themeToggle = document.getElementById("theme-checkbox");

    let contacts = [];

    function loadContacts() {
      const data = localStorage.getItem("agenda-contatos");
      if (data) {
        contacts = JSON.parse(data);
      }
    }

    function renderContacts() {
      let filtered = [...contacts];

      const searchText = searchInput.value.toLowerCase();
      const selectedCategory = filterCategory.value;
      const sort = sortSelect.value;

      if (searchText) {
        filtered = filtered.filter(c => c.name.toLowerCase().includes(searchText));
      }

      if (selectedCategory) {
        filtered = filtered.filter(c => c.category === selectedCategory);
      }

      if (sort === "az") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === "za") {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
      }

      container.innerHTML = "";

      if (filtered.length === 0) {
        container.innerHTML = "<p>Nenhum contato encontrado.</p>";
        return;
      }

      filtered.forEach(contact => {
        const card = document.createElement("div");
        card.classList.add("contact-card");
        card.innerHTML = `
          <h3>${contact.name}</h3>
          <p>📞 ${contact.phone}</p>
          <p>📧 ${contact.email || "—"}</p>
          <p>📁 Categoria: <strong>${contact.category || "—"}</strong></p>
          <p>${contact.favorite ? "⭐ Favorito" : ""}</p>
        `;
        container.appendChild(card);
      });
    }

    searchInput.addEventListener("input", renderContacts);
    filterCategory.addEventListener("change", renderContacts);
    sortSelect.addEventListener("change", renderContacts);


    window.addEventListener("DOMContentLoaded", () => {
      loadContacts();
      renderContacts();

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