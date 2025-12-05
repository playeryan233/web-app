package handlers

import (
	"context"
	"fmt"
	"io"
	"mime"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"web-app/backend/internal/config"
	"web-app/backend/internal/database"
	"web-app/backend/internal/models"

	"github.com/cloudwego/hertz/pkg/app"
	"github.com/cloudwego/hertz/pkg/common/hlog"
)

var cfg *config.Config

func init() {
	cfg = config.Load()
	// 确保上传目录存在
	if err := os.MkdirAll(cfg.Upload.Dir, 0755); err != nil {
		hlog.Errorf("Failed to create upload directory: %v", err)
	}
}

// ListImages 获取图片列表
func ListImages(ctx context.Context, c *app.RequestContext) {
	var images []models.Image
	if err := database.DB.Find(&images).Error; err != nil {
		c.JSON(500, map[string]string{"error": "Failed to fetch images"})
		return
	}
	c.JSON(200, images)
}

// GetImage 获取单张图片信息
func GetImage(ctx context.Context, c *app.RequestContext) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(400, map[string]string{"error": "Invalid image ID"})
		return
	}

	var image models.Image
	if err := database.DB.First(&image, id).Error; err != nil {
		c.JSON(404, map[string]string{"error": "Image not found"})
		return
	}

	c.JSON(200, image)
}

// UploadImage 上传图片
func UploadImage(ctx context.Context, c *app.RequestContext) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(400, map[string]string{"error": "No image file provided"})
		return
	}

	// 检查文件大小
	if file.Size > cfg.Upload.MaxSize {
		c.JSON(400, map[string]string{"error": fmt.Sprintf("File size exceeds maximum allowed size of %d bytes", cfg.Upload.MaxSize)})
		return
	}

	// 检查文件扩展名
	ext := filepath.Ext(file.Filename)
	allowed := false
	for _, allowedExt := range cfg.Upload.Allowed {
		if ext == allowedExt {
			allowed = true
			break
		}
	}
	if !allowed {
		c.JSON(400, map[string]string{"error": "File type not allowed"})
		return
	}

	// 生成唯一文件名
	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename)
	filePath := filepath.Join(cfg.Upload.Dir, filename)

	// 保存文件
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		hlog.Errorf("Failed to save file: %v", err)
		c.JSON(500, map[string]string{"error": "Failed to save image"})
		return
	}

	// 获取MIME类型
	mimeType := mime.TypeByExtension(ext)
	if mimeType == "" {
		mimeType = "application/octet-stream"
	}

	// 保存到数据库
	image := models.Image{
		Filename: file.Filename,
		Path:     filePath,
		Size:     file.Size,
		MimeType: mimeType,
	}

	if err := database.DB.Create(&image).Error; err != nil {
		// 如果数据库保存失败，删除已上传的文件
		os.Remove(filePath)
		c.JSON(500, map[string]string{"error": "Failed to save image record"})
		return
	}

	c.JSON(201, image)
}

// ServeImage 提供图片文件服务
func ServeImage(ctx context.Context, c *app.RequestContext) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(400, map[string]string{"error": "Invalid image ID"})
		return
	}

	var image models.Image
	if err := database.DB.First(&image, id).Error; err != nil {
		c.JSON(404, map[string]string{"error": "Image not found"})
		return
	}

	// 检查文件是否存在
	if _, err := os.Stat(image.Path); os.IsNotExist(err) {
		c.JSON(404, map[string]string{"error": "Image file not found"})
		return
	}

	// 打开文件
	file, err := os.Open(image.Path)
	if err != nil {
		c.JSON(500, map[string]string{"error": "Failed to open image file"})
		return
	}
	defer file.Close()

	// 设置响应头
	c.Header("Content-Type", image.MimeType)
	c.Header("Content-Disposition", fmt.Sprintf("inline; filename=\"%s\"", image.Filename))

	// 发送文件内容
	if _, err := io.Copy(c.Response.BodyWriter(), file); err != nil {
		hlog.Errorf("Failed to send image: %v", err)
	}
}

// DeleteImage 删除图片
func DeleteImage(ctx context.Context, c *app.RequestContext) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(400, map[string]string{"error": "Invalid image ID"})
		return
	}

	var image models.Image
	if err := database.DB.First(&image, id).Error; err != nil {
		c.JSON(404, map[string]string{"error": "Image not found"})
		return
	}

	// 删除文件
	if err := os.Remove(image.Path); err != nil && !os.IsNotExist(err) {
		hlog.Errorf("Failed to delete image file: %v", err)
	}

	// 删除数据库记录
	if err := database.DB.Delete(&image).Error; err != nil {
		c.JSON(500, map[string]string{"error": "Failed to delete image record"})
		return
	}

	c.JSON(200, map[string]string{"message": "Image deleted successfully"})
}
