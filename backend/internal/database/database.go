package database

import (
	"os"
	"path/filepath"

	"web-app/backend/internal/config"
	"web-app/backend/internal/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init(cfg *config.Config) error {
	var err error

	// 确保数据库目录存在
	dbDir := filepath.Dir(cfg.Database.Path)
	if err := os.MkdirAll(dbDir, 0755); err != nil {
		return err
	}

	// 初始化SQLite数据库
	DB, err = gorm.Open(sqlite.Open(cfg.Database.Path), &gorm.Config{})
	if err != nil {
		return err
	}

	// 自动迁移
	if err := DB.AutoMigrate(&models.Article{}, &models.Image{}); err != nil {
		return err
	}

	return nil
}
