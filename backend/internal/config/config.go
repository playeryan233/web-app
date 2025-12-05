package config

import (
	"os"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Upload   UploadConfig
}

type ServerConfig struct {
	Addr string
}

type DatabaseConfig struct {
	Type string
	Path string
}

type UploadConfig struct {
	Dir     string
	MaxSize int64 // 最大文件大小（字节）
	Allowed []string
}

func Load() *Config {
	return &Config{
		Server: ServerConfig{
			Addr: getEnv("SERVER_ADDR", ":8080"),
		},
		Database: DatabaseConfig{
			Type: getEnv("DB_TYPE", "sqlite"),
			Path: getEnv("DB_PATH", "./data.db"),
		},
		Upload: UploadConfig{
			Dir:     getEnv("UPLOAD_DIR", "./uploads"),
			MaxSize: 10 * 1024 * 1024, // 10MB
			Allowed: []string{".jpg", ".jpeg", ".png", ".gif", ".webp"},
		},
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
