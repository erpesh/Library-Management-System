package controllers_test

import (
	"bytes"
	"media-service/controllers"
	"media-service/services/mocks"

	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
   
        "errors"
	"net/http"

)

func TestReturnMedia_Failure(t *testing.T) {
        // Create a mock service
        mockService := &mocks.MockServices{}
        // Simulate a failed return (e.g., database error)
        mockService.On("ReturnMedia").Return(errors.New("failed to return media"))
      
        // Create a gin context
        gin.SetMode(gin.TestMode)
        router := gin.Default()
        router.POST("api/media/user/:userID/record/:id/return", controllers.ReturnMedia)
      
        // Create a test request
        req, err := http.NewRequest("POST", "api/media/user/675a211e8b465f13b51655a7/record/675a410857c6060bfe510b48/return", nil)
        if err != nil {
          t.Fatal(err)
        }
      

        w := httptest.NewRecorder()
        router.ServeHTTP(w, req)
      
        // Assert the response status code (expected to be non-200)
        assert.NotEqual(t, http.StatusOK, w.Code)
      
        // Optional: You can also assert on the error message if relevant
        // assert.Contains(t, w.Body.String(), "failed to return media")
      }
func TestReturnMedia_InvalidUserID(t *testing.T) {
	// Create a gin context
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/:userID/:id", controllers.ReturnMedia)

	// Create a test request with invalid userID
	req, err := http.NewRequest("GET", "/invalidUserID/0123456789abcdef01234567", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a response recorder
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Assert the response
	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Invalid user ID")
}

func TestRenewMedia_InvalidRequestBody(t *testing.T) {
	// Create a gin context
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/:id", controllers.RenewMedia)

	// Create a test request with invalid request body
	req, err := http.NewRequest("POST", "/1234567890abcdef12345678", bytes.NewBuffer([]byte("invalid JSON")))
	if err != nil {
		t.Fatal(err)
	}

	
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	
	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Invalid request data")
}
