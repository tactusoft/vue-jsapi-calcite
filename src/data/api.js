// Importamos Axios 
import axios from 'axios';

// Definimos la ruta local del servidor Vue JS 
export default axios.create({
    baseURL: process.env.VUE_APP_URL_API
}); 