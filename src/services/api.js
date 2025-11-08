import axios from 'axios'

const api = axios.create({
  baseURL: 'https://apiusuarios-rouge.vercel.app/',
});

export default api;