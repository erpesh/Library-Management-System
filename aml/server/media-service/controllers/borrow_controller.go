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

type BorrowRequest struct {
	ReturnAt int64 `json:"returnAt"`
}

func BorrowMedia(c *gin.Context) {
	userIDParam := c.Param("userID")
	mediaIDParam := c.Param("mediaID")

	userID, err := primitive.ObjectIDFromHex(userIDParam)
	if err != nil {
		fmt.Println("Error converting userID to ObjectID:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	mediaID, err := primitive.ObjectIDFromHex(mediaIDParam)
	if err != nil {
		fmt.Println("Error converting mediaID to ObjectID:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	// Bind the request body to BorrowRequest struct
	var borrowRequest BorrowRequest
	if err := c.ShouldBindJSON(&borrowRequest); err != nil {
		fmt.Println("Error binding request body:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Validate if ReturnAt is provided (optional: check if the time is valid)
	if borrowRequest.ReturnAt == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ReturnAt must be provided"})
		return
	}

	// Check if the return date is not before the current date
	if time.Unix(borrowRequest.ReturnAt, 0).Before(time.Now()) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Return date cannot be in the past"})
		return
	}

	// Call to inventory service to check media availability
	available, err := services.CheckMediaAvailability(mediaID)
	if err != nil {
		fmt.Println("Error checking media availability:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check media availability"})
		return
	}

	if !available {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Media not available"})
		return
	}

	rawToken, exists := c.Get("token")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token not found"})
		return
	}

	token := rawToken.(string) // safe to cast since you stored it as string

	err = services.BorrowMedia(mediaID, token)
	if err != nil {
		fmt.Println("Error borrowing media:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to borrow media"})
		return
	}

	borrowingRecord := models.BorrowingRecord{
		UserID:     userID,
		MediaID:    mediaID,
		BorrowedAt: time.Now().Unix(),
		ReturnAt:   borrowRequest.ReturnAt,
		ReturnedAt: nil,
	}

	borrowingCollection := utils.GetBorrowingCollection()
	_, err = borrowingCollection.InsertOne(c, borrowingRecord)
	if err != nil {
		fmt.Println("Error inserting borrowing record into database:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create borrowing record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Media borrowed successfully"})
}


func CheckMediaBorrowingStatus(c *gin.Context) {
    userIDParam := c.Param("userID")
    mediaIDParam := c.Param("mediaID")

    userID, err := primitive.ObjectIDFromHex(userIDParam)
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
        "returnedAt": nil,
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

func GetBorrowingRecordsByUserID(c *gin.Context) {
	userIDParam := c.Param("userID")

	userID, err := primitive.ObjectIDFromHex(userIDParam)
	if err != nil {
		fmt.Println("Error converting userID to ObjectID:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Fetch borrowing records for the user
	borrowingCollection := utils.GetBorrowingCollection()
	var borrowingRecords []models.BorrowingRecord
	cursor, err := borrowingCollection.Find(c, bson.M{"userID": userID})
	if err != nil {
		fmt.Println("Error finding borrowing records:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch borrowing records"})
		return
	}
	defer cursor.Close(c)

	for cursor.Next(c) {
		var record models.BorrowingRecord
		if err := cursor.Decode(&record); err != nil {
			fmt.Println("Error decoding borrowing record:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode borrowing record"})
			return
		}
		borrowingRecords = append(borrowingRecords, record)
	}

	if err := cursor.Err(); err != nil {
		fmt.Println("Cursor error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading borrowing records"})
		return
	}

	var mediaIDs []primitive.ObjectID
	for _, record := range borrowingRecords {
		mediaIDs = append(mediaIDs, record.MediaID)
	}

	mediaList, err := services.GetMediaByIds(mediaIDs)
	if err != nil {
		fmt.Println("Error fetching media details:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch media details"})
		return
	}

	mediaMap := make(map[string]*models.Media)
	for _, media := range mediaList {
		mediaMap[media.ID] = &media
	}

	var result []models.Media
	for i := range borrowingRecords {
		mediaID := borrowingRecords[i].MediaID.Hex()
		media := mediaMap[mediaID]

		if media == nil {
			fmt.Printf("Warning: Media not found for MediaID %s\n", mediaID)
			continue
		}

		mediaCopy := *media
		mediaCopy.BorrowingRecord = &borrowingRecords[i]
		result = append(result, mediaCopy)
	}

	c.JSON(http.StatusOK, result)
}
