package controllers

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"media-service/models"
	"media-service/utils"
	"net/http"
)


func RenewMedia(c *gin.Context) {
	var renewRequest struct {
		MediaID primitive.ObjectID `json:"mediaID"`
	}

	if err := c.ShouldBindJSON(&renewRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	borrowingCollection := utils.GetBorrowingCollection()
	var borrowingRecord models.BorrowingRecord
	err := borrowingCollection.FindOne(c, primitive.M{"userID": 1, "mediaID": renewRequest.MediaID}).Decode(&borrowingRecord)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Borrowing record not found"})
		return
	}

	borrowingRecord.ReturnAt = borrowingRecord.ReturnAt + 30*24*60*60
	_, err = borrowingCollection.UpdateOne(c, primitive.M{"_id": borrowingRecord.ID}, primitive.M{"$set": primitive.M{"returnAt": borrowingRecord.ReturnAt}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to renew borrowing record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Media renewed successfully"})
}
