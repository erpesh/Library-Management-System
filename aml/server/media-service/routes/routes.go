package routes

import (
	"media-service/controllers"
	"github.com/gin-gonic/gin"
	"media-service/utils"
)

func RegisterRoutes(router *gin.Engine) {
	mediaApi := router.Group("/api/media", utils.AuthenticateJWT())

	mediaApi.POST("/notify/:mediaID", controllers.NotifyUsersToReturn)

	// User based routes
	userGroup := mediaApi.Group("/user/:userID")

	userGroup.POST("/media/:mediaID", controllers.BorrowMedia)
	userGroup.GET("/", controllers.GetBorrowingRecordsByUserID)

	userGroup.POST("/record/:id/return", controllers.ReturnMedia)
	userGroup.POST("/record/:id/renew", controllers.RenewMedia)
	
	// Check media borrowing status by user and media
	userGroup.GET("/media/:mediaID", controllers.CheckMediaBorrowingStatus)
}
