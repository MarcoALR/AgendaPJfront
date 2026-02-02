import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import agendapjLogo from "./logoagenda.png";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./style.css";

function Home() {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [themeDark, setThemeDark] = useState(false);

  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL || "https://apiusuariospj.onrender.com/";

  useEffect(() => {
    const usuario = localStorage.getItem("usuarioLogado");
    const accessToken = localStorage.getItem("accessToken");

    const savedTheme = localStorage.getItem("themeDark") === "true";
    setThemeDark(savedTheme);

    if (usuario && accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
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
    const response = await axios.post(`${API_URL}/login`, {
      login: loginValue,
      password,
    });

    // 👇 DEBUG (pode remover depois)
    console.log("LOGIN RESPONSE:", response.data);

    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;
    const usuario = response.data.usuario;

    // 🚨 GARANTIA
    if (!accessToken) {
      setErrorMsg("⚠️ Token não recebido do servidor.");
      return;
    }

    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify({
        name: usuario?.name,
        email: usuario?.email,
      })
    );
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    setErrorMsg("");
    navigate("/criarcontato");
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    if (error.response?.status === 401) {
      setErrorMsg("⚠️ Usuário ou senha incorretos.");
    } else if (error.message === "Network Error") {
      setErrorMsg("⚠️ Servidor indisponível.");
    } else {
      setErrorMsg("⚠️ Erro ao tentar logar.");
    }
  }
};
  const irParaCadastro = () => {
    navigate("/cadastrar");
  };
  
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          localStorage.clear();
          navigate("/");
          return Promise.reject(error);
        }

        try {
          const res = await axios.post(`${API_URL}/refresh-token`, {
            refreshToken,
          });

          const newAccessToken = res.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

          return axios(originalRequest);
        } catch (refreshError) {
          localStorage.clear();
          navigate("/");
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

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
            id="login"
            placeholder=" "
            required
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            className={loginValue ? "has-content" : ""}
          />
          <label htmlFor="login">Nome ou E-mail</label>
        </div>

        <div className="input-container">
          <input
            type={showPassword ? "text" : "password"}
            id="senha"
            placeholder=" "
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={password ? "has-content" : ""}
          />
          <label htmlFor="senha">Senha</label>
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle-icon"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button onClick={login}>Entrar</button>
        <button onClick={irParaCadastro} className="botao-cadastro">
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
