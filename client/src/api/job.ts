import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const getJobs = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/api/jobs`, { headers: {
    Authorization: `Bearer ${token}`,
  },
  withCredentials: true,
  });
  return response.data;
};
