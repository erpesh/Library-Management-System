package controllers

import (
	"media-service/models"
	"media-service/services"
	"media-service/utils"
	"net/http"
	"strconv"
	"time"
	"go.mongodb.org/mongo-driver/mongo"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"fmt"
)

func BorrowMedia(c *gin.Context) {
	// Extract userID and mediaID from URL parameters
	userIDParam := c.Param("userID")
	mediaIDParam := c.Param("mediaID")

	// Debug log: print out the parameters
	fmt.Println("Received userIDParam:", userIDParam)
	fmt.Println("Received mediaIDParam:", mediaIDParam)

	// Convert userID to integer
	userID, err := strconv.Atoi(userIDParam)
	if err != nil {
		fmt.Println("Error converting userID to integer:", err) // Debugging error
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	// Debug log: userID successfully converted
	fmt.Println("Converted userID:", userID)

	// Convert mediaID to MongoDB ObjectID
	mediaID, err := primitive.ObjectIDFromHex(mediaIDParam)
	if err != nil {
		fmt.Println("Error converting mediaID to ObjectID:", err) // Debugging error
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}
	// Debug log: mediaID successfully converted
	fmt.Println("Converted mediaID:", mediaID.Hex())

	// Check if media is available
	available, err := services.CheckMediaAvailability(mediaID)
	if err != nil {
		fmt.Println("Error checking media availability:", err) // Debugging error
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check media availability"})
		return
	}
	// Debug log: media availability status
	fmt.Println("Media availability status:", available)

	if !available {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Media not available"})
		return
	}

	// Borrow media
	err = services.BorrowMedia(mediaID)
	if err != nil {
		fmt.Println("Error borrowing media:", err) // Debugging error
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to borrow media"})
		return
	}

	// Create the borrowing record
	borrowingRecord := models.BorrowingRecord{
		UserID:     userID,
		MediaID:    mediaID,
		BorrowedAt: time.Now().Unix(),
		ReturnAt:   time.Now().Add(30 * 24 * time.Hour).Unix(),
	}

	// Debug log: print out the borrowing record to be inserted
	fmt.Println("Borrowing Record:", borrowingRecord)

	// Insert the borrowing record into the database
	borrowingCollection := utils.GetBorrowingCollection()
	_, err = borrowingCollection.InsertOne(c, borrowingRecord)
	if err != nil {
		fmt.Println("Error inserting borrowing record into database:", err) // Debugging error
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create borrowing record"})
		return
	}

	// Successful borrowing response
	c.JSON(http.StatusOK, gin.H{"message": "Media borrowed successfully"})
}


func CheckMediaBorrowingStatus(c *gin.Context) {
    userIDParam := c.Param("userID")
    mediaIDParam := c.Param("mediaID")

    userID, err := strconv.Atoi(userIDParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    mediaID, err := primitive.ObjectIDFromHex(mediaIDParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
        return
    }

    borrowingCollection := utils.GetBorrowingCollection()

    var borrowingRecord models.BorrowingRecord

    err = borrowingCollection.FindOne(c, bson.M{
        "mediaID": mediaID,
        "userID":  userID,
        "returnAt": bson.M{
            "$gte": time.Now().Unix(),
        },
    }).Decode(&borrowingRecord)

    if err != nil {
        if err == mongo.ErrNoDocuments {
            c.JSON(http.StatusOK, gin.H{
                "isBorrowed": false,
            })
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check borrowing record"})
        }
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "isBorrowed":    true,
        "borrowingRecord": borrowingRecord,
    })
}


