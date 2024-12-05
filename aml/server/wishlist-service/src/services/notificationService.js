const axios = require('axios');

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL;

const axiosApi = axios.create({
    baseURL: NOTIFICATION_SERVICE_URL,
});

const sendWishlistNotification = async (requestObject) => {
    try {
        const response = await axiosApi.post(`/send-wishlist`, requestObject);
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
    }
};

module.exports = {
    sendWishlistNotification,
};