import axios from 'axios';

const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  }
});

export default publicAxios;
