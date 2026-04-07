import axios, { AxiosRequestConfig } from 'axios';
import { getAccessToken } from '../auth';
import { setAuthenticated } from 'services/auth';

const privateAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
});

const refreshRefreshToken = () =>
  axios({
    method: 'get',
    url: `${process.env.NEXT_PUBLIC_API_URL}session`,
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
      "Access-Control-Allow-Origin": "*",
    },
  });

const getConfigWithToken = (config: AxiosRequestConfig) => ({
  ...config,
  headers: {
    ...config.headers,
    Authorization: `bearer ${getAccessToken()}`,
  },
});

privateAxios.interceptors.response.use(
  async response => {
    return response;
  },
  async error => {
    if (401 === error?.response?.status) {
      //setAuthenticated(false);
      console.log("NOT PERMITTED")
    }
  },
);

privateAxios.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = getAccessToken();
  config.headers.Authorization =  `Bearer ${token}`;   
  return config;
  });

export default privateAxios;
