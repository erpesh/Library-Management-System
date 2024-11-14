package controllers

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"media-service/models"
	"media-service/services"
	"media-service/utils"
	"net/http"
	"time"
)

func BorrowMedia(c *gin.Context) {
	mediaIDParam := c.Param("id")
	mediaID, err := primitive.ObjectIDFromHex(mediaIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	available, err := services.CheckMediaAvailability(mediaID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check media availability"})
		return
	}

	if !available {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Media not available"})
		return
	}

	err = services.BorrowMedia(mediaID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to borrow media"})
		return
	}

	borrowingRecord := models.BorrowingRecord{
		UserID:     1,
		MediaID:    mediaID,
		BorrowedAt: time.Now().Unix(),
		ReturnAt:   time.Now().Add(30 * 24 * time.Hour).Unix(),
	}

	borrowingCollection := utils.GetBorrowingCollection()
	_, err = borrowingCollection.InsertOne(c, borrowingRecord)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create borrowing record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Media borrowed successfully"})
}
