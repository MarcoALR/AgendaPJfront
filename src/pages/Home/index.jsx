import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import agendapjLogo from './logoagenda.png';
import axios from 'axios';
import './style.css';

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [color, setColor] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = color || '';
  }, [color]);

  useEffect(() => {
    const usuario = localStorage.getItem('usuarioLogado');
    if (usuario) {
      navigate('/criarcontato'); 
    }
  }, [navigate]);

  const login = async () => {
    if (!email || !password) {
      setErrorMsg('Preencha todos os campos.');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'https://apiusuarios-afl5.onrender.com'}/login`,
        { email, password }
      );

      localStorage.setItem('usuarioLogado', JSON.stringify(response.data.user));

      navigate('/criarcontato');
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMsg('Email ou senha incorretos.');
      } else if (error.message === 'Network Error') {
        setErrorMsg('Servidor indisponível. Verifique sua conexão.');
      } else {
        setErrorMsg('Erro ao tentar logar. Tente novamente mais tarde.');
      }
    }
  };

  const irParaCadastro = () => {
    navigate('/cadastrar');
  };

  return (
    <div className="banner">
      <h2>👥 Bem - vindo à Agenda PJ 👥</h2>

      <div className="login-container">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
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
