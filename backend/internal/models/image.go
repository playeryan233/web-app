package models

import (
	"time"

	"gorm.io/gorm"
)

type Image struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Filename  string         `json:"filename" gorm:"not null"`
	Path      string         `json:"path" gorm:"not null"`
	Size      int64          `json:"size"`
	MimeType  string         `json:"mime_type"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}
