package routes

import (
	"media-service/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	router.POST("/:id/borrow", controllers.BorrowMedia)
	router.POST("/:id/return", controllers.ReturnMedia)
	router.POST("/:id/renew", controllers.RenewMedia)
}
