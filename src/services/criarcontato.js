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

    let contacts = [];
    let editingId = null;

    const form = document.getElementById("contact-form");
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");
    const categorySelect = document.getElementById("category");
    const container = document.getElementById("contacts-container");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const email = emailInput.value.trim();
      const category = categorySelect.value;

      const errorDiv = document.getElementById("form-error") || (() => {
        const div = document.createElement("div");
        div.id = "form-error";
        div.style.color = "red";
        div.style.fontWeight = "bold";
        div.style.marginTop = "10px";
        form.after(div);
        return div;
      })();

      const successDiv = document.getElementById("form-success") || (() => {
        const div = document.createElement("div");
        div.id = "form-success";
        div.style.color = "green";
        div.style.fontWeight = "bold";
        div.style.marginTop = "5px";
        errorDiv.after(div);
        return div;
      })();

      errorDiv.textContent = "";
      successDiv.textContent = "";

      const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (name.length < 2) {
        errorDiv.textContent = "⚠️ Nome deve ter pelo menos 2 letras.";
        return;
      }

      if (!phoneRegex.test(phone)) {
        errorDiv.textContent = "⚠️ Telefone inválido. Use o formato (32) 99999-9999.";
        return;
      }

      if (email && !emailRegex.test(email)) {
        errorDiv.textContent = "⚠️ Email inválido.";
        return;
      }

      if (!category) {
        errorDiv.textContent = "⚠️ Selecione uma categoria.";
        return;
      }

      const telefoneDuplicado = contacts.some(c => c.phone === phone && c.id !== editingId);
      if (telefoneDuplicado) {
        errorDiv.textContent = "⚠️ Este telefone já está cadastrado.";
        return;
      }

      const emailDuplicado = email && contacts.some(c => c.email === email && c.id !== editingId);
      if (emailDuplicado) {
        errorDiv.textContent = "⚠️ Este email já está cadastrado.";
        return;
      }

      if (editingId) {
        const index = contacts.findIndex(c => c.id === editingId);
        if (index !== -1) {
          contacts[index] = { ...contacts[index], name, phone, email, category };
          editingId = null;
        }
      } else {
        contacts.push({
          id: Date.now(),
          name,
          phone,
          email,
          category,
          favorite: false,
        });
      }

      saveContacts();
      renderContacts();
      form.reset();
      form.querySelector("button").textContent = "Adicionar Contato";
      successDiv.textContent = "✅ Contato salvo com sucesso!";
      setTimeout(() => successDiv.textContent = "", 3000);
    });

    function renderContacts() {
      container.innerHTML = "";

      contacts.forEach(contact => {
        const card = document.createElement("div");
        card.classList.add("contact-card");

        const isFav = contact.favorite ? "⭐" : "☆";

        card.innerHTML = `
        <h3>${contact.name}</h3>
        <p>📞 ${contact.phone}</p>
        <p>📧 ${contact.email || "—"}</p>
        <p>📁 Categoria: <strong>${contact.category || "—"}</strong></p>
        <button onclick="toggleFavorite(${contact.id})">${isFav} Favorito</button>
        <button onclick="editContact(${contact.id})">✏️ Editar</button>
        <button onclick="deleteContact(${contact.id})">🗑️ Excluir</button>
      `;

        container.appendChild(card);
      });
    }

  function deleteContact(id) {
  contacts = contacts.filter(contact => contact.id !== id);
  saveContacts();
  renderContacts();
}
window.deleteContact = deleteContact;

function editContact(id) {
  const contact = contacts.find(c => c.id === id);
  if (contact) {
    nameInput.value = contact.name;
    phoneInput.value = contact.phone;
    emailInput.value = contact.email;
    categorySelect.value = contact.category;
    editingId = id;
    form.querySelector("button").textContent = "Salvar Edição";
  }
}
window.editContact = editContact;


 function toggleFavorite(id) {
  const index = contacts.findIndex(c => c.id === id);
  if (index !== -1) {
    contacts[index].favorite = !contacts[index].favorite;
    saveContacts();
    renderContacts();
  }
}
window.toggleFavorite = toggleFavorite;


    function saveContacts() {
      localStorage.setItem("agenda-contatos", JSON.stringify(contacts));
    }

    function loadContacts() {
      const data = localStorage.getItem("agenda-contatos");
      if (data) {
        contacts = JSON.parse(data);
      }
    }

    const themeToggle = document.getElementById("theme-checkbox");

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