package utils

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
)

var client *mongo.Client

func ConnectToDB() {
	mongoURI := os.Getenv("MONGO_URI")
	var err error
	client, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("MongoDB connected successfully!")
}

func GetDB() *mongo.Client {
	return client
}

func GetBorrowingCollection() *mongo.Collection {
	db := client.Database("mediaDB")
	return db.Collection("borrowing")
}
