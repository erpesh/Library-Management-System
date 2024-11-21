// main.go
package main

import (
    "github.com/gin-gonic/gin"
    "log"
)

func main() {
    // Connect to MongoDB
    // ConnectToDB()
    
    // Initialize Gin router
    router := gin.Default()

    // Sample route
    router.GET("/api/media/test", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "Hello from Media Service!"})
    })

    // Start the server
    if err := router.Run(":8080"); err != nil {
        log.Fatal("Failed to run the server: ", err)
    }
}
