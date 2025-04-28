import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

interface CompleteProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  start_date?: string;
  job_id?: number;
}

export const completeProfile = async (profileData: CompleteProfileData, token: string) => {
  const response = await axios.post(`${BASE_URL}/api/employee/complete-profile`, profileData, { headers: {
    Authorization: `Bearer ${token}`,
   },
  withCredentials: true,
  });
  return response.data;
};
