package controllers

import (
	"media-service/models"
	"media-service/services"
	"media-service/utils"
	"net/http"
	"time"
	"go.mongodb.org/mongo-driver/mongo"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"fmt"

)

func ReturnMedia(c *gin.Context) {
	userIDParam := c.Param("userID")
	borrowingRecordIDParam := c.Param("id")

	fmt.Println("Received userIDParam:", userIDParam)
	fmt.Println("Received borrowingRecordIDParam:", borrowingRecordIDParam)

	// Validate user ID
	userID, err := primitive.ObjectIDFromHex(userIDParam)
	if err != nil {
		fmt.Println("Error converting userID to ObjectID:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Validate borrowing record ID
	borrowingRecordID, err := primitive.ObjectIDFromHex(borrowingRecordIDParam)
	if err != nil {
		fmt.Println("Error converting borrowingRecordID to ObjectID:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowing record ID"})
		return
	}

	borrowingCollection := utils.GetBorrowingCollection()

	// Find the borrowing record
	var borrowingRecord models.BorrowingRecord
	err = borrowingCollection.FindOne(c, bson.M{
		"_id":    borrowingRecordID,
		"userID": userID,
	}).Decode(&borrowingRecord)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No borrowing record found for this ID and user"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check borrowing record"})
		}
		return
	}

	// Update media status to mark as returned
	err = services.ReturnMedia(borrowingRecord.MediaID)
	if err != nil {
		fmt.Println("Error returning media:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to return media"})
		return
	}

	// Update the borrowing record's returnedAt field
	returnedAt := time.Now().Unix()
	update := bson.M{
		"$set": bson.M{
			"returnedAt": returnedAt,
		},
	}

	_, err = borrowingCollection.UpdateOne(c, bson.M{
		"_id": borrowingRecordID,
	}, update)

	if err != nil {
		fmt.Println("Error updating borrowing record:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update borrowing record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Media returned successfully",
		"returnedAt": returnedAt,
	})
}
