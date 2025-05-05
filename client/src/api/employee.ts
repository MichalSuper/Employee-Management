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
  const response = await axios.post(`${BASE_URL}/api/employee/complete-profile`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

export const getAllEmployees = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/api/employee`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

export const getEmployeeById = async (employeeId: number, token: string) => {
  const response = await axios.get(`${BASE_URL}/api/employee/${employeeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

export const updateEmployee = async (
  employeeId: number,
  updatedData: CompleteProfileData,
  token: string
) => {
  const response = await axios.put(`${BASE_URL}/api/employee/${employeeId}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

export const deleteEmployee = async (employeeId: number, token: string) => {
  const response = await axios.delete(`${BASE_URL}/api/employee/${employeeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

export const addEmployee = async (newEmployeeData: CompleteProfileData, token: string) => {
  const response = await axios.post(`${BASE_URL}/api/employee`, newEmployeeData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

export const getEmployeeByUserId = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/api/employee/by-user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};
