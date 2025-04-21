const axios = require('axios');

const mediaApi = axios.create({
    baseURL: process.env.MEDIA_SERVICE_URL,
});

const checkMediaBorrowingStatus = async (userId, mediaId, token) => {
    try {
      const response = await mediaApi.get(
        `/user/${userId}/media/${mediaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Media service error:", error?.response?.data || error.message);
      return null;
    }
  };
  

module.exports = {
    checkMediaBorrowingStatus,
};