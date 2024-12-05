const axios = require('axios');

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL;

const axiosApi = axios.create({
    baseURL: NOTIFICATION_SERVICE_URL,
});

const sendWishlistNotification = async (ids) => {
    try {
        const response = await axiosApi.post(`/?perPage=100&ids=${ids.join(',')}`);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
    }
};

module.exports = {
    getMediaByIds,
};