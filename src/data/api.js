import axios from 'axios';

// Definimos la ruta local del servidor Vue JS 
export const api =  axios.create({
    baseURL: process.env.VUE_APP_URL_API
}); 

export default {
    getParam(paramID) {
        return api.post('', {"id_parametro": paramID, "nombre_parametro": ""});
    }
}

