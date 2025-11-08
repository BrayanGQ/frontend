import axios from 'axios';

// Configuración base de la API
const API_URL = 'https://backend-wvf7.onrender.com/api';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Servicios para Ventas
export const ventasService = {
  // Obtener sucursales
  obtenerSucursales: async () => {
    const response = await apiClient.get('/vehiculos/sucursales');
    return response.data;
  },

  // Obtener productos
  obtenerProductos: async () => {
    const response = await apiClient.get('/vehiculos/productos');
    return response.data;
  },

  // Obtener producto por ID
  obtenerProductoPorId: async (id) => {
    const response = await apiClient.get(`/vehiculos/productos/${id}`);
    return response.data;
  },

  // Crear venta
  crearVenta: async (venta) => {
    console.log('Enviando venta:', venta);
    const response = await apiClient.post('/vehiculos/ventas', venta);
    console.log('Respuesta:', response.data);
    return response.data;
  }
};