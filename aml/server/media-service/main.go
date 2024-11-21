package main

import (
	"log"
	"media-service/utils"
	"media-service/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	utils.ConnectToDB()

	r := gin.Default()

	routes.RegisterRoutes(r)

	if err := r.Run(":8080"); err != nil {
		log.Fatal("Error starting server: ", err)
	}
}
