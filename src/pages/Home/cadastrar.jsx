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
  const [isLoading, setIsLoading] = useState(false);

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
    setEmailHint(
      value && !emailRegex.test(value)
        ? "⚠️ E-mail inválido: exemplo@dominio.com"
        : ""
    );
  }

  function handlePasswordInput(e) {
    const value = e.target.value;
    setPasswordValue(value);
    inputPassword.current.value = value;
    validatePasswordStrength(value);
  }

  async function createUsers() {
    if (isLoading) return;
    setIsLoading(true);

    const name = inputName.current.value;
    const email = inputEmail.current.value;
    const password = inputPassword.current.value;
    const confirmPassword = inputConfirmPassword.current.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!emailRegex.test(email)) {
      showMessage("⚠️ Insira um e-mail válido!", "erro");
      setIsLoading(false);
      return;
    }

    if (!senhaRegex.test(password)) {
      showMessage(
        "⚠️ A senha deve conter no mínimo 8 caracteres, incluindo letras e números.",
        "erro"
      );
      setIsLoading(false);
      return;
    }

    if (passwordStrength === "Fraca") {
      showMessage(
        "⚠️ A senha está fraca. Use letras, números e símbolos.",
        "erro"
      );
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showMessage("⚠️ As senhas não coincidem!", "erro");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/usuarios", { name, email, password });

      let token = null;
      try {
        const loginResponse = await api.post("/login", {
          login: email,
          password,
        });
        token = loginResponse.data.accessToken;
      } catch {
        console.warn("⚠️ Login falhou após cadastro.");
      }

      if (token) {
        try {
          await api.post(
            "/enviar-email",
            {
              to: email,
              subject: "Bem-vindo ao Agenda PJ!",
              message: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
            <img src="https://agenda-pj.vercel.app/agendapjlogo.png" alt="Agenda PJ" style="height: 100px; margin-bottom: 10px;" />
            <h1 style="color: #ecf0f1; margin: 0; font-size: 24px;">Seja bem-vindo ao Agenda PJ!</h1>
          </div>
          <div style="padding: 20px; color: #333333;">
            <p style="font-size: 16px;">Olá, <strong>${name}</strong>,</p>
            <p style="font-size: 16px;">
              Seu cadastro foi realizado com sucesso na plataforma <strong>Agenda PJ</strong>!
            </p>
            <p style="font-size: 16px;">
              Agora você pode acessar o sistema utilizando seu e-mail e a senha cadastrada.
            </p>
            <p style="font-size: 16px;">
              Estamos muito felizes em ter você conosco e esperamos que o <strong>Agenda PJ</strong> facilite sua organização e produtividade!
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://apiusuariospj.onrender.com" target="_blank" style="background-color: #34495e; color: #fff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                Acessar Agenda PJ
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
            <p style="font-size: 13px; color: #888;">
              Caso você não tenha solicitado este cadastro, por favor, ignore este e-mail.
            </p>
          </div>
          <div style="background-color: #ecf0f1; padding: 10px; text-align: center; font-size: 12px; color: #7f8c8d;">
            &copy; ${new Date().getFullYear()} Agenda PJ. Todos os direitos reservados.
          </div>
        </div>
      </div>
    `,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (emailError) {
          console.warn(
            "❌ Falha ao enviar o e-mail de boas-vindas",
            emailError
          );
        }
      }

      showMessage("✅ Usuário criado com sucesso!", "sucesso");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      if (error.response?.status === 409) {
        showMessage("❌ E-mail já cadastrado ❌", "erro");
      } else {
        showMessage(
          "❌ Erro ao criar usuário. Tente novamente mais tarde. ❌",
          "erro"
        );
      }
      console.error(error);
    } finally {
      setIsLoading(false);
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
        <div className={`feedback-message ${message.type}`}>{message.text}</div>
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
