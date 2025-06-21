import axios from 'axios'

const api = axios.create({
  baseURL: 'https://apiusuariospj.onrender.com/',
});

export default api;