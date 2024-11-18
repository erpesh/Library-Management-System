const axios = require('axios');

const mediaApi = axios.create({
    baseURL: process.env.MEDIA_SERVICE_URL,
});

const checkMediaBorrowingStatus = async (userId, mediaId) => {
    try {
        const response = await mediaApi.get(`/user/${userId}/media/${mediaId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

module.exports = {
    checkMediaBorrowingStatus,
};