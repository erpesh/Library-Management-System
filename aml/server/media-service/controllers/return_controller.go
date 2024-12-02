package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"media-service/models"
	"media-service/utils"
)

func ReturnMedia(c *gin.Context) {
	// Extract borrowing record ID from URL parameters
	borrowingRecordID := c.Param("id")
	if borrowingRecordID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Borrowing record ID is required"})
		return
	}

	// Parse the borrowing record ID into an ObjectID
	recordID, err := primitive.ObjectIDFromHex(borrowingRecordID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowing record ID"})
		return
	}

	// Get the borrowing collection
	borrowingCollection := utils.GetBorrowingCollection()

	// Context for MongoDB operations
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Find the borrowing record
	var borrowingRecord models.BorrowingRecord
	err = borrowingCollection.FindOne(ctx, bson.M{"_id": recordID}).Decode(&borrowingRecord)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Borrowing record not found"})
		return
	}

	// Now, we will update the borrowing record:
	// - Set isBorrowed to false (indicating the item has been returned).
	// - Increment the stock if required.

	_, err = borrowingCollection.UpdateOne(
		ctx,
		bson.M{"_id": recordID},
		bson.M{
			"$set": bson.M{
				"isBorrowed": false,
			},
			"$inc": bson.M{
				"stock": 1, // Increment stock as the media is returned
			},
		},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update borrowing record"})
		return
	}

	// Delete the borrowing record after returning the media
	_, err = borrowingCollection.DeleteOne(ctx, bson.M{"_id": recordID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete borrowing record"})
		return
	}

	// Respond with success
	c.JSON(http.StatusOK, gin.H{"message": "Media returned successfully"})
}
