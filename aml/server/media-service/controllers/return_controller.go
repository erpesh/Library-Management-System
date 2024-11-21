package controllers

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"media-service/models"
	"media-service/services"
	"media-service/utils"
	"net/http"
)

func ReturnMedia(c *gin.Context) {
	var returnRequest struct {
		MediaID primitive.ObjectID `json:"mediaID"`
	}

	if err := c.ShouldBindJSON(&returnRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	borrowingCollection := utils.GetBorrowingCollection()
	var borrowingRecord models.BorrowingRecord
	err := borrowingCollection.FindOne(c, primitive.M{"userID": 1, "mediaID": returnRequest.MediaID}).Decode(&borrowingRecord)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Borrowing record not found"})
		return
	}

	err = services.ReturnMedia(returnRequest.MediaID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to return media"})
		return
	}

	_, err = borrowingCollection.DeleteOne(c, primitive.M{"_id": borrowingRecord.ID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete borrowing record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Media returned successfully"})
}
