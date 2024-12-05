const axios = require('axios');

const wishlistApi = axios.create({
    baseURL: process.env.WISHLIST_SERVICE_URL,
});

const getWishlistRecord = async (userId, mediaId) => {
    try {
        const response = await wishlistApi.get(`/user/${userId}/media/${mediaId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getWishlistRecordsByMediaIdAndNotify = async (mediaId) => {
    try {
        const response = await wishlistApi.post(`/media/${mediaId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

module.exports = {
    getWishlistRecord,
    getWishlistRecordsByMediaIdAndNotify
};