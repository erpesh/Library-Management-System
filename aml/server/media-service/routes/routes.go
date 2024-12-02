package routes

import (
	"media-service/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	apiMedia := router.Group("/api/media/user/:userID")

	apiMedia.POST("/media/:mediaID", controllers.BorrowMedia)
	apiMedia.GET("/", controllers.GetBorrowingRecordsByUserID)

	apiMedia.POST("/record/:id/return", controllers.ReturnMedia)
	apiMedia.POST("/record/:id/renew", controllers.RenewMedia)
	

	// Check media borrowing status by user and media
	apiMedia.GET("/media/:mediaID", controllers.CheckMediaBorrowingStatus)

	// Get borrowing history by userId (optional, you can uncomment and implement it)
	// apiMedia.GET("/user/:userID/history", controllers.GetBorrowingHistory)
}
