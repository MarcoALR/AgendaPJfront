import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import agendapjLogo from "./logoagenda.png";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./style.css";

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [color, setColor] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL || "https://apiusuarios-afl5.onrender.com";

  useEffect(() => {
    document.body.style.backgroundColor = color || "";
  }, [color]);

  useEffect(() => {
    const usuario = localStorage.getItem("usuarioLogado");
    const accessToken = localStorage.getItem("accessToken");
    if (usuario && accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
     window.location.href = "/criarcontato.html";
    }
  }, [navigate]);

  const login = async () => {
    if (!email || !password) {
      setErrorMsg("⚠️ Preencha todos os campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrorMsg("⚠️ Insira um @ / e-mail válido.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
  
      const { accessToken, refreshToken, usuario } = response.data;

      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setErrorMsg("");

      navigate("/criarcontato");
      setTimeout(() => window.location.reload(), 300);
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMsg("⚠️ Email ou senha incorretos.");
      } else if (error.message === "Network Error") {
        setErrorMsg("⚠️ Servidor indisponível. Verifique sua conexão.");
      } else {
        setErrorMsg("⚠️ Erro ao tentar logar. Tente novamente mais tarde.");
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
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

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
    <div className="banner">
      <h2>👥 Bem - vindo à Agenda PJ 👥</h2>

      <div className="login-container">
        <div className="input-container">
          <input
            style={{ color: "#333" }}
            type="email"
            id="email"
            placeholder=" "
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={email ? "has-content" : ""}
          />
          <label htmlFor="email">E-mail</label>
        </div>

        <div className="input-container">
          <input
            style={{ color: "#333" }}
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
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#aaa",
            }}
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
  );
}

export default Home;
