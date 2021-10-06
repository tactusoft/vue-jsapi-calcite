// Importamos Axios 
import axios from 'axios';

// Definimos la ruta local del servidor Vue JS 
export default axios.create({
    baseURL: 'http://sis.scrd.gov.co/crud_SCRD_pv/api'
}); 