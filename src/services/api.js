import axios from 'axios'

const api = axios.create({
  baseURL: 'https://apiusuarios-afl5.onrender.com',
});

export default api;