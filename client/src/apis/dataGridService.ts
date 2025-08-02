import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getSchema = async () => {
  const response = await axios.get(`${API_URL}/schema`);
  return response.data;
};

export const getData = async (tableName: string) => {
    const response = await axios.get(`${API_URL}/data/${tableName}`);
    return response.data;
};

export const filterData = async (tableName: string, filters: string) => {
    const response = await axios.post(`${API_URL}/data/${tableName}`, { filters });
    return response.data;
}

export const getDetails = async (tableName: string, id: string) => {
    const response = await axios.get(`${API_URL}/details/${tableName}/${id}`);
    return response.data;
}

export const deleteData = async (tableName: string, id: string) => {
    const response = await axios.delete(`${API_URL}/data/${tableName}/${id}`);
    return response.data;
}