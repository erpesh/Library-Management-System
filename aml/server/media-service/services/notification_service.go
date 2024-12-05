package services

import (
	"encoding/json"
	"fmt"
	"media-service/models"
	"net/http"
	"os"
	"strings"
)

var NotificationBaseURL = os.Getenv("NOTIFICATION_SERVICE_URL")

type Payload struct {
	BorrowingRecords []models.BorrowingRecord `json:"borrowingRecords"`
	Media            models.Media             `json:"media"`
}

func SendReturnNotification(payload Payload) (bool, error) {
	fmt.Print("base url", NotificationBaseURL)
	url := fmt.Sprintf("%s/send-return", NotificationBaseURL)

	fmt.Println(url)

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return false, fmt.Errorf("failed to marshal payload: %v", err)
	}

	resp, err := http.Post(url, "application/json", strings.NewReader(string(payloadBytes)))
	if err != nil {
		return false, fmt.Errorf("failed to send return notification")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return false, fmt.Errorf("failed to send return notification")
	}

	return true, nil
}
