import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import agendapjLogo from "./logoagenda.png";
import api from "../../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./style.css";

function Home() {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [themeDark, setThemeDark] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const usuario = localStorage.getItem("usuarioLogado");
    const accessToken = localStorage.getItem("accessToken");

    const savedTheme = localStorage.getItem("themeDark") === "true";
    setThemeDark(savedTheme);

    if (usuario && accessToken) {
      navigate("/criarcontato");
    }
  }, [navigate]);

  const handleThemeToggle = () => {
    const newTheme = !themeDark;
    setThemeDark(newTheme);
    localStorage.setItem("themeDark", newTheme ? "true" : "false");
  };

  const login = async () => {
    if (!loginValue || !password) {
      setErrorMsg("⚠️ Preencha todos os campos.");
      return;
    }

    try {
      const response = await api.post("/login", {
        login: loginValue,
        password,
      });

      const { accessToken, refreshToken, usuario } = response.data;

      if (!accessToken) {
        throw new Error("Token não recebido");
      }

      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify({
          id: usuario.id,
          name: usuario.name,
          email: usuario.email,
        })
      );
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setErrorMsg("");
      navigate("/criarcontato");
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMsg("⚠️ Usuário ou senha incorretos.");
      } else {
        setErrorMsg("⚠️ Erro ao fazer login.");
      }
    }
  };

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

      <h2>👥 Bem-vindo à Agenda PJ 👥</h2>

      <div className="login-container">
        <div className="input-container">
          <input
            type="text"
            placeholder=" "
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            className={loginValue ? "has-content" : ""}
          />
          <label>Nome ou E-mail</label>
        </div>

        <div className="input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={password ? "has-content" : ""}
          />
          <label>Senha</label>
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle-icon"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button onClick={login}>Entrar</button>
        <button
          onClick={() => navigate("/cadastrar")}
          className="botao-cadastro"
        >
          Criar conta
        </button>

        {errorMsg && <div className="error">{errorMsg}</div>}
      </div>

      <footer className="logo">
        <img src={agendapjLogo} alt="Logo Agenda PJ" className="logo-img" />
      </footer>
    </div>
  );
}

export default Home;
