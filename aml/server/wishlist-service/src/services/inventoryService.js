const axios = require('axios');

const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL;

const axiosApi = axios.create({
    baseURL: INVENTORY_SERVICE_URL,
});

const getInventoryByIds = async (ids) => {
    try {
        const response = await axiosApi.get('/', {
            params: {
                ids: ids.join(','),
            },
        });
        return response.data.mediaItems;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
    }
};

module.exports = {
    getInventoryByIds,
};