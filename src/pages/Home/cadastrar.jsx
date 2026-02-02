import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import agendapjLogo from "./logoagenda.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../services/api";

function Cadastrar() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [strengthPercent, setStrengthPercent] = useState(0);
  const [emailHint, setEmailHint] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const [themeDark, setThemeDark] = useState(false);

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
    setEmailValue(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailHint(
      value && !emailRegex.test(value)
        ? "⚠️ E-mail inválido: exemplo@dominio.com"
        : ""
    );
  }

  function handlePasswordInput(e) {
    const value = e.target.value;
    setPasswordValue(value);
    validatePasswordStrength(value);
  }

  async function createUsers() {
    if (isLoading) return;

    const name = nameValue;
    const email = emailValue;
    const password = passwordValue;
    const confirmPassword = confirmPasswordValue;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage("⚠️ Insira um e-mail válido!", "erro");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("⚠️ As senhas não coincidem!", "erro");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Criar o usuário
      await api.post("/usuarios", { name, email, password });

      // 2. Avisar sucesso e redirecionar imediatamente
      showMessage("✅ Usuário criado com sucesso!", "sucesso");
      
      // CORREÇÃO: Delay de 800ms para garantir que o banco de dados (MongoDB) 
      // sincronizou o novo registro antes de tentar o login automático.
      setTimeout(() => {
        enviarEmailBoasVindas(name, email, password);
      }, 800);

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      if (error.response?.status === 409) {
        showMessage("❌ E-mail já cadastrado ❌", "erro");
      } else {
        showMessage("❌ Erro ao criar usuário. Tente novamente. ❌", "erro");
      }
      setIsLoading(false);
    }
  }

  async function enviarEmailBoasVindas(name, email, password) {
    try {
      // Login automático para obter token de autorização
      const loginResponse = await api.post("/login", { login: email, password });
      const token = loginResponse.data.accessToken;

      if (token) {
        await api.post("/enviar-email", {
          to: email,
          subject: "Bem-vindo ao Agenda PJ!",
          message: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
              <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
                  <h1 style="color: #ecf0f1; margin: 0; font-size: 24px;">Seja bem-vindo ao Agenda PJ!</h1>
                </div>
                <div style="padding: 20px; color: #333333;">
                  <p>Olá, <strong>${name}</strong>,</p>
                  <p>Seu cadastro foi realizado com sucesso! Esperamos que a Agenda PJ facilite sua organização.</p>
                  <div style="text-align: center; margin: 20px;">
                     <a href="https://agenda-pj.vercel.app" style="background-color: #34495e; color: #fff; padding: 12px 24px; border-radius: 5px; text-decoration: none;">Acessar Sistema</a>
                  </div>
                </div>
              </div>
            </div>`
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.error("Falha silenciosa no envio do e-mail. Verifique o log do servidor.");
    }
  }

  function handleThemeToggle() {
    const newTheme = !themeDark;
    setThemeDark(newTheme);
    localStorage.setItem("themeDark", newTheme ? "true" : "false");
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("themeDark") === "true";
    setThemeDark(savedTheme);
  }, []);

  return (
    <div className={`banner ${themeDark ? "dark" : ""}`}>
      <div className="theme-toggle">
        <span>🌗</span>
        <label className="switch">
          <input type="checkbox" checked={themeDark} onChange={handleThemeToggle} />
          <span className="slider"></span>
        </label>
        <span>🌙</span>
      </div>

      <h2>👥 Crie sua conta na Agenda PJ 👥</h2>

      {message && <div className={`feedback-message ${message.type}`}>{message.text}</div>}

      <div className="login-container">
        <div className="input-container">
          <input
            type="text"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            className={nameValue ? "has-content" : ""}
            placeholder=" "
            required
          />
          <label>Nome</label>
        </div>

        {emailHint && <p className="input-hint">{emailHint}</p>}

        <div className="input-container">
          <input
            type="email"
            value={emailValue}
            onChange={handleEmailInput}
            className={emailValue ? "has-content" : ""}
            placeholder=" "
            required
          />
          <label>E-mail</label>
        </div>

        <div className="input-container password-container">
          <input
            type={showPassword ? "text" : "password"}
            value={passwordValue}
            onChange={handlePasswordInput}
            className={`password-input ${passwordValue ? "has-content" : ""}`}
            placeholder=" "
            required
          />
          <label>Senha</label>
          <span onClick={() => setShowPassword(!showPassword)} className="password-toggle-icon">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="input-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPasswordValue}
            onChange={(e) => setConfirmPasswordValue(e.target.value)}
            className={`password-input ${confirmPasswordValue ? "has-content" : ""}`}
            placeholder=" "
            required
          />
          <label>Confirmar Senha</label>
          <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle-icon">
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {passwordStrength && (
          <>
            <div className="strength-bar">
              <div className={`bar-inner ${passwordStrength.toLowerCase()}`} style={{ width: `${strengthPercent}%` }}></div>
            </div>
            <p className={`senha-${passwordStrength.toLowerCase()}`}>Força da senha: {passwordStrength}</p>
          </>
        )}

        <button onClick={createUsers} disabled={isLoading}>
          {isLoading ? "Carregando..." : "Criar a conta"}
        </button>
      </div>

      <footer className="logo">
        <img src={agendapjLogo} alt="Logo Agenda PJ" className="logo-img" />
      </footer>
    </div>
  );
}

export default Cadastrar;