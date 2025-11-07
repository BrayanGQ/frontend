import axios from 'axios';

// Configuración base de la API
const API_URL = 'https://backend-wvf7.onrender.com/api';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Importante: Para desarrollo con certificados autofirmados
  httpsAgent: {
    rejectUnauthorized: false
  }
});

// Servicios para Vehículos
export const vehiculosService = {
  // Obtener todos los vehículos
  obtenerTodos: async () => {
    const response = await apiClient.get('/vehiculos');
    return response.data;
  },

  // Obtener vehículo por ID
  obtenerPorId: async (id) => {
    const response = await apiClient.get(`/vehiculos/${id}`);
    return response.data;
  },

  // Crear vehículo
  crear: async (vehiculo) => {
    const response = await apiClient.post('/vehiculos', vehiculo);
    return response.data;
  },

  // Actualizar vehículo
  actualizar: async (id, vehiculo) => {
    const response = await apiClient.put(`/vehiculos/${id}`, vehiculo);
    return response.data;
  },

  // Eliminar vehículo
  eliminar: async (id) => {
    const response = await apiClient.delete(`/vehiculos/${id}`);
    return response.data;
  }
};