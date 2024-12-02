package services

import (
	"os"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
)

var BaseURL = os.Getenv("INVENTORY_SERVICE_URL")

func CheckMediaAvailability(mediaID primitive.ObjectID) (bool, error) {
	url := fmt.Sprintf("%s/%s/available", BaseURL, mediaID.Hex())

	fmt.Println(url)

	resp, err := http.Get(url)
	if err != nil {
		return false, fmt.Errorf("failed to check media availability")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return false, fmt.Errorf("failed to check media availability")
	}

	var response struct {
		Available bool `json:"available"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return false, fmt.Errorf("failed to decode response")
	}

	return response.Available, nil
}

func BorrowMedia(mediaID primitive.ObjectID) error {
	url := fmt.Sprintf("%s/%s/borrow", BaseURL, mediaID.Hex())

	resp, err := http.Post(url, "application/json", nil)
	if err != nil {
		return fmt.Errorf("failed to borrow media")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to borrow media")
	}
	return nil
}

func ReturnMedia(mediaID primitive.ObjectID) error {
	url := fmt.Sprintf("%s/%s/return", BaseURL, mediaID.Hex())

	resp, err := http.Post(url, "application/json", nil)
	if err != nil {
		return fmt.Errorf("failed to return media")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to return media")
	}

	return nil
}
