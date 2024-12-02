package controllers

import (
	"media-service/models"
	"media-service/services"
	"media-service/utils"
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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

    // Retrieve the borrowing record to get the mediaID
    var borrowingRecord models.BorrowingRecord
    filter := bson.M{
        "_id":      borrowingRecordID,
        "userID":   userID,
        "returnedAt": bson.M{
            "$exists": false, // Ensure it hasn't been returned yet
        },
    }
    err = borrowingCollection.FindOne(c, filter).Decode(&borrowingRecord)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            fmt.Println("No matching borrowing record found")
            c.JSON(http.StatusBadRequest, gin.H{"error": "No borrowing record found for this ID and user"})
        } else {
            fmt.Println("Error fetching borrowing record:", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch borrowing record"})
        }
        return
    }

    // Update the borrowing record to set ReturnedAt
    currentTimestamp := time.Now().Unix()
    update := bson.M{
        "$set": bson.M{
            "returnedAt": currentTimestamp,
        },
    }
    res, err := borrowingCollection.UpdateOne(c, filter, update)
    if err != nil {
        fmt.Println("Error updating borrowing record:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update borrowing record"})
        return
    }
    if res.MatchedCount == 0 {
        fmt.Println("No matching borrowing record found during update")
        c.JSON(http.StatusBadRequest, gin.H{"error": "No borrowing record found for this ID and user"})
        return
    }

    // Call the service to return the media using the mediaID
    err = services.ReturnMedia(borrowingRecord.MediaID)
    if err != nil {
        fmt.Println("Error in service while returning media:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to return media"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":    "Media returned successfully",
        "returnedAt": currentTimestamp, // Return the timestamp for client confirmation
    })
}


