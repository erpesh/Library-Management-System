package models

import "time"

type Media struct {
	ID            string     `json:"_id"`
	Title         string     `json:"title"`
	MediaType     string     `json:"mediaType"`
	Genre         string     `json:"genre"`
	ReleaseDate   time.Time  `json:"releaseDate"`
	Stock         int        `json:"stock"`
	Description   string     `json:"description"`
	ImageUrl      string     `json:"imageUrl"`
	Borrowed      int        `json:"borrowed"`
	Author        *string    `json:"author,omitempty"`     // Optional field
	Publisher     *string    `json:"publisher,omitempty"`
	Platform      *string    `json:"platform,omitempty"` // Optional, can be null
	Artist        *string    `json:"artist,omitempty"`   // Optional, can be null
	CreatedAt     time.Time  `json:"createdAt"`
	IsBorrowed    *bool      `json:"isBorrowed,omitempty"`
	BorrowingRecord *BorrowingRecord `json:"borrowingRecord,omitempty"`
}
