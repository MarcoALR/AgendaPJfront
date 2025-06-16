import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import agendapjLogo from "./logoagenda.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../services/api";


function Home() {
  const navigate = useNavigate();
  const [Users, setUsers] = useState([]);
  const [color, setColor] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [strengthPercent, setStrengthPercent] = useState(0);
  const [emailHint, setEmailHint] = useState("");

  const inputName = useRef();
  const inputEmail = useRef();
  const inputPassword = useRef();
  const inputConfirmPassword = useRef();

  async function getUsers() {
    const usersFrmApi = await api.get("/usuarios");
    setUsers(usersFrmApi.data);
  }

  function showMessage(text, type = "sucesso") {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  }

  function validatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrengthPercent((score / 5) * 100);
    if (score <= 2) setPasswordStrength("Fraca");
    else if (score === 3 || score === 4) setPasswordStrength("Média");
    else if (score === 5) setPasswordStrength("Forte");
  }

  function handleEmailInput(e) {
    const value = e.target.value;
    inputEmail.current.value = value;
    if (value && !value.includes("@")) {
      setEmailHint("💡 Adicione um '@' no email");
    } else {
      setEmailHint("");
    }
  }

  function handlePasswordInput(e) {
    const value = e.target.value;
    inputPassword.current.value = value;
    validatePasswordStrength(value);
  }

  async function createUsers() {
    const name = inputName.current.value;
    const email = inputEmail.current.value;
    const password = inputPassword.current.value;
    const confirmPassword = inputConfirmPassword.current.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    const commonDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "live.com",
    ];
    const domainSuggestions = {
      "gmal.com": "gmail.com",
      "gnail.com": "gmail.com",
      "gmaill.com": "gmail.com",
      "yaho.com": "yahoo.com",
      "hotmial.com": "hotmail.com",
      "outlok.com": "outlook.com",
    };

    if (!emailRegex.test(email)) {
      showMessage("⚠️ Insira um e-mail válido!", "erro");
      return;
    }

    const domain = email.split("@")[1]?.toLowerCase();
    if (domain && domainSuggestions[domain]) {
      showMessage(
        `⚠️ Você quis dizer "${email.split("@")[0]}@${
          domainSuggestions[domain]
        }"? Corrija o domínio.`,
        "erro"
      );
      return;
    }

    const isCommonDomain = commonDomains.includes(domain);
    if (!isCommonDomain) {
      showMessage(
        `⚠️ Atenção: o domínio de e-mail "${domain}" é incomum. Verifique se está correto.`,
        "erro"
      );
      return;
    }

    if (!senhaRegex.test(password)) {
      showMessage(
        "⚠️ A senha deve conter no mínimo 8 caracteres, incluindo letras e números.",
        "erro"
      );
      return;
    }

    if (passwordStrength === "Fraca") {
      showMessage(
        "⚠️ A senha está fraca. Use letras, números e símbolos para torná-la mais segura.",
        "erro"
      );
      return;
    }

    if (password !== confirmPassword) {
      showMessage("⚠️ As senhas não coincidem!", "erro");
      return;
    }

    try {
      await api.post("/usuarios", { name, email, password });
      showMessage("✅ Usuário criado com sucesso!", "sucesso");
      getUsers();

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      showMessage("❌ Erro ao criar usuário.", "erro");
      console.error(error);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = color || "";
  }, [color]);

  return (
    <>
      <div className="banner">
        <h2>👥 Bem-vindo à Agenda PJ 👥</h2>

        {message && (
          <div className={`feedback-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="login-container">
          <input type="text" placeholder="Nome" required ref={inputName} />
          <input
            type="email"
            placeholder="Email"
            required
            onChange={handleEmailInput}
            ref={inputEmail}
          />
          {emailHint && <p className="input-hint">{emailHint}</p>}

          <div className="password-container">
            <input
              className="password-input"
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              required
              onChange={handlePasswordInput}
              ref={inputPassword}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="password-toggle-icon"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {passwordStrength && (
            <>
              <div className="strength-bar">
                <div
                  className={`bar-inner ${passwordStrength.toLowerCase()}`}
                  style={{ width: `${strengthPercent}%` }}
                ></div>
              </div>
              <p className={`senha-${passwordStrength.toLowerCase()}`}>
                Força da senha: {passwordStrength}
              </p>
            </>
          )}

          <div className="password-container">
            <input
              className="password-input"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar Senha"
              required
              ref={inputConfirmPassword}
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="password-toggle-icon"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button onClick={createUsers}>Criar</button>
        </div>

        <footer>
          <div id="Marco">
            <input
              className="interacao"
              type="text"
              placeholder="Digite uma cor em inglês ou #FF0000"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </footer>

        <div className="logo">
          <img src={agendapjLogo} alt="Logo Agenda PJ" className="logo-img" />
        </div>
      </div>
    </>
  );
}

export default Home;
