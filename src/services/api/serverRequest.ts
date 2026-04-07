import axios from 'axios';

export const createServerClient = (req: any) => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: req ? { 
      cookie: req.headers.cookie,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
     } : undefined,
  });
}

export const createServerClientWithToken = (req: any, token: string) => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
      'Cookie': req.headers.cookie,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': token
    },
  });
}

