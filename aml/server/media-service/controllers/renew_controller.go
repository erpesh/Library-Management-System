package controllers

import (
	"context"
	"fmt"
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"media-service/models"
	"media-service/utils"
	"io"
	"bytes"
)

func RenewMedia(c *gin.Context) {
	// Extract borrowing record ID from URL parameters
	borrowingRecordID := c.Param("id")
	if borrowingRecordID == "" {
		fmt.Println("[ERROR] Missing borrowing record ID in request")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Borrowing record ID is required"})
		return
	}
	fmt.Println("[DEBUG] Borrowing Record ID:", borrowingRecordID)

	// Parse the borrowing record ID into an ObjectID
	recordID, err := primitive.ObjectIDFromHex(borrowingRecordID)
	if err != nil {
		fmt.Println("[ERROR] Invalid Borrowing Record ID:", borrowingRecordID, "Error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid borrowing record ID"})
		return
	}
	fmt.Println("[DEBUG] Parsed ObjectID for Borrowing Record:", recordID.Hex())

	// Parse the request body for the new return date
	var requestBody struct {
		NewReturnDate int64 `json:"newReturnDate"` // Expecting Unix timestamp in seconds
	}

	// Log the raw request body for debugging
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Println("[ERROR] Failed to read request body:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read request body"})
		return
	}
	fmt.Println("[DEBUG] Raw Request Body:", string(body))

	// Rewind the body for JSON binding
	c.Request.Body = io.NopCloser(bytes.NewReader(body))

	// Bind the JSON data to the struct
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		fmt.Println("[ERROR] Failed to bind JSON request body:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}
	fmt.Println("[DEBUG] Received New Return Date (Unix):", requestBody.NewReturnDate)

	// Validate the new return date
	if requestBody.NewReturnDate <= time.Now().Unix() {
		fmt.Println("[ERROR] New return date is in the past:", requestBody.NewReturnDate)
		c.JSON(http.StatusBadRequest, gin.H{"error": "New return date must be in the future"})
		return
	}

	// Get the borrowing collection
	borrowingCollection := utils.GetBorrowingCollection()
	fmt.Println("[DEBUG] Borrowing collection obtained")

	// Context for MongoDB operations
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Find the borrowing record
	var borrowingRecord models.BorrowingRecord
	err = borrowingCollection.FindOne(ctx, bson.M{"_id": recordID}).Decode(&borrowingRecord)
	if err != nil {
		fmt.Println("[ERROR] Borrowing record not found for ID:", recordID.Hex(), "Error:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Borrowing record not found"})
		return
	}
	fmt.Println("[DEBUG] Found Borrowing Record:", borrowingRecord)

	// Update the borrowing record with the new return date
	fmt.Println("[DEBUG] Attempting to update return date to:", requestBody.NewReturnDate)
	updateResult, err := borrowingCollection.UpdateOne(
		ctx,
		bson.M{"_id": recordID},
		bson.M{
			"$set": bson.M{
				"returnAt": requestBody.NewReturnDate, // Set the new return date
			},
		},
	)
	if err != nil {
		fmt.Println("[ERROR] Failed to update borrowing record:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update borrowing record"})
		return
	}
	fmt.Println("[DEBUG] Update Result - MatchedCount:", updateResult.MatchedCount)

	// Check if the record was successfully updated
	if updateResult.MatchedCount == 0 {
		fmt.Println("[ERROR] Borrowing record not found for update:", recordID.Hex())
		c.JSON(http.StatusNotFound, gin.H{"error": "Borrowing record not found"})
		return
	}

	// Respond with success
	fmt.Println("[DEBUG] Borrowing record updated successfully for ID:", recordID.Hex())
	c.JSON(http.StatusOK, gin.H{
		"message":       "Borrowing record updated successfully",
		"newReturnDate": time.Unix(requestBody.NewReturnDate, 0).Format(time.RFC3339), // Return new date in human-readable format
	})
}
