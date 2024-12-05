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

func NotifyUsersToReturn(c *gin.Context) {
    mediaIDParam := c.Param("mediaID")

    fmt.Println("Received mediaIDParam:", mediaIDParam)

    // Validate media ID
    mediaID, err := primitive.ObjectIDFromHex(mediaIDParam)
    if err != nil {
        fmt.Println("Error converting mediaID to ObjectID:", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
        return
    }

    // Get all borrowing records for the media that are not returned
    borrowingCollection := utils.GetBorrowingCollection()

    filter := bson.M{
        "mediaID": mediaID,
        "returnedAt": bson.M{
            "$exists": false, // Ensure it hasn't been returned yet
        },
    }

    cursor, err := borrowingCollection.Find(c, filter)
    if err != nil {
        fmt.Println("Error fetching borrowing records:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch borrowing records"})
        return
    }
    defer cursor.Close(c)

    var borrowingRecords []models.BorrowingRecord
    if err = cursor.All(c, &borrowingRecords); err != nil {
        fmt.Println("Error decoding borrowing records:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode borrowing records"})
        return
    }

    if len(borrowingRecords) == 0 {
        fmt.Println("No borrowing records found for this media")
        c.JSON(http.StatusOK, gin.H{"message": "No emails to send, no borrowing records found for this media"})
        return
    }

    // Get user IDs from borrowing records
    var userIDs []primitive.ObjectID
    for _, record := range borrowingRecords {
        userIDs = append(userIDs, record.UserID)
    }

    // Get user emails by user IDs
    userEmails, err := services.GetEmailsByUserIds(userIDs)
    if err != nil {
        fmt.Println("Error fetching user emails:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user emails"})
        return
    }

    // Add emails to borrowing records
    for i, record := range borrowingRecords {
        if email, ok := userEmails[record.UserID.Hex()]; ok {
            borrowingRecords[i].UserEmail = &email
        } else {
            fmt.Println("No email found for user ID:", record.UserID.Hex())
        }
    }

    // Get the media details
    mediaArray, err := services.GetMediaByIds([]primitive.ObjectID{mediaID})
    if err != nil {
        fmt.Println("Error fetching media details:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch media details"})
        return
    }

    if len(mediaArray) == 0 {
        fmt.Println("No media found for this ID")
        c.JSON(http.StatusBadRequest, gin.H{"error": "No media found for this ID"})
        return
    }

    media := mediaArray[0]

    // Prepare the payload for notification service
    payload := services.Payload{
        BorrowingRecords: borrowingRecords,
        Media:            media,
    }

    // Call the notification service to send return notifications
    success, err := services.SendReturnNotification(payload)
    if err != nil {
        fmt.Println("Error in service while sending return notifications:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send return notifications"})
        return
    }

    if !success {
        fmt.Println("Failed to send return notifications")
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send return notifications"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "Return notifications sent successfully",
    })
}
