import { useEffect, useState, useRef } from "react";
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

  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const [themeDark, setThemeDark] = useState(false);

  const inputName = useRef();
  const inputEmail = useRef();
  const inputPassword = useRef();
  const inputConfirmPassword = useRef();

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
    inputEmail.current.value = value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value && !emailRegex.test(value)) {
      setEmailHint("⚠️ E-mail inválido: exemplo@dominio.com");
    } else {
      setEmailHint("");
    }
  }

  function handlePasswordInput(e) {
    const value = e.target.value;
    setPasswordValue(value);
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

    if (!emailRegex.test(email)) {
      showMessage("⚠️ Insira um e-mail válido!", "erro");
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

      setTimeout(() => {
        navigate("/");
      }, 900);
    } catch (error) {
      showMessage("❌ Erro ao criar usuário / E-mail já cadastrado ❌", "erro");
      console.error(error);
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
    <>
      <div className={`banner ${themeDark ? "dark" : ""}`}>
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

        <h2>👥 Crie sua conta na Agenda PJ 👥</h2>

        {message && (
          <div className={`feedback-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="login-container">
          <div className="input-container">
            <input
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              ref={inputName}
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
              ref={inputEmail}
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
              ref={inputPassword}
              className={`password-input ${passwordValue ? "has-content" : ""}`}
              placeholder=" "
              required
            />
            <label>Senha</label>
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="password-toggle-icon"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPasswordValue}
              onChange={(e) => setConfirmPasswordValue(e.target.value)}
              ref={inputConfirmPassword}
              className={`password-input ${
                confirmPasswordValue ? "has-content" : ""
              }`}
              placeholder=" "
              required
            />
            <label>Confirmar Senha</label>
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="password-toggle-icon"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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

          <button onClick={createUsers}>Criar a conta</button>
        </div>

        <footer className="logo">
          <img src={agendapjLogo} alt="Logo Agenda PJ" className="logo-img" />
        </footer>
      </div>
    </>
  );
}

export default Cadastrar;
