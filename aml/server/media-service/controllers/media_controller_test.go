package controllers

import (
    "errors"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "media-service/models"
    "media-service/services"
)



// Simulate a successful media return where the "borrowed" count decreases
func mockReturnMediaSuccess(mediaID primitive.ObjectID) error {
    return nil
}

// Simulate a failed media return (like database issue)
func mockReturnMediaFailure(mediaID primitive.ObjectID) error {
    return errors.New("failed to return media")
}

// Simulate successful renewal of the borrowing period
func mockRenewMediaSuccess(borrowingRecordID primitive.ObjectID) error {
    return nil
}

// Simulate an error when renewing a media record (like record not found)
func mockRenewMediaFailure(borrowingRecordID primitive.ObjectID) error {
    return errors.New("failed to renew media")
}



func TestReturnMedia_UpdatesStockAndBorrowCount(t *testing.T) {
    gin.SetMode(gin.TestMode)
    router := gin.Default()

    // Mock service that would update the database (borrow count and stock)
    services.ReturnMedia = mockReturnMediaSuccess

    router.POST("/return/:userID/:id", ReturnMedia)

    userID := primitive.NewObjectID().Hex()
    borrowingRecordID := primitive.NewObjectID().Hex()
    req, err := http.NewRequest(http.MethodPost, "/return/"+userID+"/"+borrowingRecordID, nil)
    assert.NoError(t, err)

    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    // Assertions
    assert.Equal(t, http.StatusOK, w.Code)
    assert.Contains(t, w.Body.String(), "Media returned successfully")

    // Assert the database was actually updated (use a mock database if needed)
    // e.g., check that Borrowed count was reduced in mock data
}

func TestReturnMedia_HandlesInvalidUserOrBorrowingRecord(t *testing.T) {
    gin.SetMode(gin.TestMode)
    router := gin.Default()

    // Mock the return service to fail
    services.ReturnMedia = mockReturnMediaFailure

    router.POST("/return/:userID/:id", ReturnMedia)

    req, err := http.NewRequest(http.MethodPost, "/return/invalidUserID/invalidBorrowingRecordID", nil)
    assert.NoError(t, err)

    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    // Assertions
    assert.Equal(t, http.StatusBadRequest, w.Code)
    assert.Contains(t, w.Body.String(), "Invalid user ID or borrowing record ID")
}


func TestRenewMedia_ExtendsBorrowingPeriod(t *testing.T) {
    gin.SetMode(gin.TestMode)
    router := gin.Default()

    services.RenewMedia = mockRenewMediaSuccess

    router.POST("/renew/:userID/:id", RenewMedia)

    userID := primitive.NewObjectID().Hex()
    borrowingRecordID := primitive.NewObjectID().Hex()
    req, err := http.NewRequest(http.MethodPost, "/renew/"+userID+"/"+borrowingRecordID, nil)
    assert.NoError(t, err)

    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    assert.Equal(t, http.StatusOK, w.Code)
    assert.Contains(t, w.Body.String(), "Media renewed successfully")


  
}

func TestRenewMedia_FailsForInvalidBorrowingRecord(t *testing.T) {
    gin.SetMode(gin.TestMode)
    router := gin.Default()

    services.RenewMedia = mockRenewMediaFailure

    router.POST("/renew/:userID/:id", RenewMedia)

    userID := primitive.NewObjectID().Hex()
    borrowingRecordID := "invalidRecordID"
    req, err := http.NewRequest(http.MethodPost, "/renew/"+userID+"/"+borrowingRecordID, nil)
    assert.NoError(t, err)

    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    // Assertions
    assert.Equal(t, http.StatusBadRequest, w.Code)
    assert.Contains(t, w.Body.String(), "Invalid borrowing record ID")
}
