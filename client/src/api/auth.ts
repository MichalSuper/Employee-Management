import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
    email: string;
    password: string;
}

export const loginUser = async (loginData: LoginData) => {
  const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData, {
    withCredentials: true,
  });
  return response.data;
};

export const registerUser = async (registerData: RegisterData) => {
  const response = await axios.post(`${BASE_URL}/api/auth/register`, registerData, {
    withCredentials: true,
  });
  return response.data;
};
