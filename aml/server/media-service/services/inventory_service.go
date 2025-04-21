package services

import (
	"encoding/json"
	"fmt"
	"media-service/models"
	"net/http"
	"net/url"
	"os"
	"strings"
	"go.mongodb.org/mongo-driver/bson/primitive"

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

func BorrowMedia(mediaID primitive.ObjectID, token string) error {
	url := fmt.Sprintf("%s/%s/borrow", BaseURL, mediaID.Hex())

	// Create a new POST request
	req, err := http.NewRequest("POST", url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token) // ✅ Attach token here

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("borrow request failed with status: %s", resp.Status)
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

func GetMediaByIds(mediaIDs []primitive.ObjectID) ([]models.Media, error) {
	var mediaIDStrings []string
	for _, id := range mediaIDs {
		mediaIDStrings = append(mediaIDStrings, id.Hex())
	}

	idsQuery := strings.Join(mediaIDStrings, ",")

	requestURL := fmt.Sprintf("%s/?perPage=100&ids=%s", BaseURL, url.QueryEscape(idsQuery))
	fmt.Println("Request URL: ", requestURL)

	resp, err := http.Get(requestURL)
	if err != nil {
		return nil, fmt.Errorf("failed to make GET request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get media by IDs, status code: %d", resp.StatusCode)
	}

	var response struct {
		MediaItems []models.Media `json:"mediaItems"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("failed to decode response: %v", err)
	}

	fmt.Println("Response", response)
	return response.MediaItems, nil
}

func GetEmailsByUserIds(userIDs []primitive.ObjectID) (map[string]string, error) {
	var userIDStrings []string
	for _, id := range userIDs {
		userIDStrings = append(userIDStrings, id.Hex())
	}

	idsQuery := strings.Join(userIDStrings, ",")
	requestURL := fmt.Sprintf("%s/emails?userIds=%s", BaseURL, url.QueryEscape(idsQuery))
	fmt.Println("Request URL: ", requestURL)

	resp, err := http.Get(requestURL)
	if err != nil {
		return nil, fmt.Errorf("failed to make GET request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get emails by user IDs, status code: %d", resp.StatusCode)
	}

	var response map[string]string
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("failed to decode response: %v", err)
	}

	return response, nil
}
