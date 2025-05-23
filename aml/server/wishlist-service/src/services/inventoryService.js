const axios = require('axios');

const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL;

const axiosApi = axios.create({
    baseURL: INVENTORY_SERVICE_URL,
});

const getMediaByIds = async (ids) => {
    try {
        const response = await axiosApi.get(`/?perPage=100&ids=${ids.join(',')}`);
        return response.data.mediaItems;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
    }
};

const getEmailsByUserIds = async (ids) => {
    try {
        const response = await axiosApi.get(`/emails?userIds=${ids.join(',')}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
    }
};

module.exports = {
    getMediaByIds,
    getEmailsByUserIds,
};