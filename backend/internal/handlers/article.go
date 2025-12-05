package handlers

import (
	"context"
	"strconv"

	"web-app/backend/internal/database"
	"web-app/backend/internal/models"

	"github.com/cloudwego/hertz/pkg/app"
)

// ListArticles 获取文章列表
func ListArticles(ctx context.Context, c *app.RequestContext) {
	var articles []models.Article
	if err := database.DB.Find(&articles).Error; err != nil {
		c.JSON(500, map[string]string{"error": "Failed to fetch articles"})
		return
	}
	c.JSON(200, articles)
}

// GetArticle 获取单篇文章
func GetArticle(ctx context.Context, c *app.RequestContext) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(400, map[string]string{"error": "Invalid article ID"})
		return
	}

	var article models.Article
	if err := database.DB.First(&article, id).Error; err != nil {
		c.JSON(404, map[string]string{"error": "Article not found"})
		return
	}

	c.JSON(200, article)
}

// CreateArticle 创建文章
func CreateArticle(ctx context.Context, c *app.RequestContext) {
	var article models.Article
	if err := c.BindAndValidate(&article); err != nil {
		c.JSON(400, map[string]string{"error": err.Error()})
		return
	}

	if article.Title == "" {
		c.JSON(400, map[string]string{"error": "Title is required"})
		return
	}

	if err := database.DB.Create(&article).Error; err != nil {
		c.JSON(500, map[string]string{"error": "Failed to create article"})
		return
	}

	c.JSON(201, article)
}

// UpdateArticle 更新文章
func UpdateArticle(ctx context.Context, c *app.RequestContext) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(400, map[string]string{"error": "Invalid article ID"})
		return
	}

	var article models.Article
	if err := database.DB.First(&article, id).Error; err != nil {
		c.JSON(404, map[string]string{"error": "Article not found"})
		return
	}

	var updateData models.Article
	if err := c.BindAndValidate(&updateData); err != nil {
		c.JSON(400, map[string]string{"error": err.Error()})
		return
	}

	if updateData.Title != "" {
		article.Title = updateData.Title
	}
	if updateData.Content != "" {
		article.Content = updateData.Content
	}

	if err := database.DB.Save(&article).Error; err != nil {
		c.JSON(500, map[string]string{"error": "Failed to update article"})
		return
	}

	c.JSON(200, article)
}

// DeleteArticle 删除文章
func DeleteArticle(ctx context.Context, c *app.RequestContext) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(400, map[string]string{"error": "Invalid article ID"})
		return
	}

	if err := database.DB.Delete(&models.Article{}, id).Error; err != nil {
		c.JSON(500, map[string]string{"error": "Failed to delete article"})
		return
	}

	c.JSON(200, map[string]string{"message": "Article deleted successfully"})
}
