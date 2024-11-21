// db.go
package main

import (
    "context"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "log"
    "os"
)

var client *mongo.Client

// ConnectToDB establishes a connection to the MongoDB database.
func ConnectToDB() {
    mongoURI := os.Getenv("MONGO_URI") // MongoDB URI from environment variable
    var err error
    client, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoURI))
    if err != nil {
        log.Fatal(err)
    }

    // Ping the database to verify connection
    err = client.Ping(context.TODO(), nil)
    if err != nil {
        log.Fatal(err)
    }

    log.Println("MongoDB connected successfully!")
}

// GetDB returns the MongoDB client
func GetDB() *mongo.Client {
    return client
}
