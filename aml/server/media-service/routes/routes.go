package routes

import (
	"media-service/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	apiMedia := router.Group("/api/media")

	apiMedia.GET("/user/:userID", controllers.GetBorrowingRecordsByUserID)
	apiMedia.POST("/user/:userID/media/:mediaID", controllers.BorrowMedia)

	// TODO: implement the following routes, where :id is the borrowing record ID
	apiMedia.POST("/:id/return", controllers.ReturnMedia)
	apiMedia.POST("/:id/renew", controllers.RenewMedia)

	// Check media borrowing status by user and media
	apiMedia.GET("/user/:userID/media/:mediaID", controllers.CheckMediaBorrowingStatus)

	// Get borrowing history by userId (optional, you can uncomment and implement it)
	// apiMedia.GET("/user/:userID/history", controllers.GetBorrowingHistory)
}
