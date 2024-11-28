package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"media-service/utils"
)

func RenewMedia(c *gin.Context) {
	// Extract the borrowing record ID from the URL parameters
	borrowingRecordID := c.Param("id")
	if borrowingRecordID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Borrowing Record ID is required"})
		return
	}

	// Parse the borrowing record ID into a MongoDB ObjectID
	borrowingObjectID, err := primitive.ObjectIDFromHex(borrowingRecordID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Borrowing Record ID"})
		return
	}

	// Get the request body
	var requestBody struct {
		NewReturnDate int64 `json:"newReturnDate"` // Expecting the Unix timestamp (seconds)
	}

	// Bind the request body to the struct
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Convert the new return date from Unix timestamp (we keep it as int64, no conversion to time.Time)
	newReturnDate := requestBody.NewReturnDate

	// Get the borrowing collection
	borrowingCollection := utils.GetBorrowingCollection()

	// Context for MongoDB operations
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Find and update the borrowing record with the new return date (store as Unix timestamp)
	updateResult, err := borrowingCollection.UpdateOne(
		ctx,
		bson.M{"_id": borrowingObjectID}, // Match the record by its ID
		bson.M{
			"$set": bson.M{
				"renewAt": newReturnDate, // Store the new return date as Unix timestamp
			},
		},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update borrowing record"})
		return
	}

	// If no record was updated, return an error
	if updateResult.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Borrowing record not found"})
		return
	}

	// Respond with success
	c.JSON(http.StatusOK, gin.H{
		"message":      "Borrowing record updated successfully",
		"newRenewDate": time.Unix(newReturnDate, 0).Format(time.RFC3339), // Optionally, send the new renew date in a readable format
	})
}
