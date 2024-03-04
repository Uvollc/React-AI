import axios from 'axios';

export const getPublicAccess = () => {
  const baseUrl = import.meta.env.VITE_UVO_HEALTH_API_URL;
  const endPoint = `public_access`;
  return axios.get(`${baseUrl}/${endPoint}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};