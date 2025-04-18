// client/src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://evault2-1.onrender.com', // ✅ Your backend Render URL
  withCredentials: true,
});

export default instance;
