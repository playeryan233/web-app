package router

import (
	"web-app/backend/internal/handlers"

	"github.com/cloudwego/hertz/pkg/app/server"
)

func RegisterRoutes(h *server.Hertz) {
	api := h.Group("/api")
	{
		// 文章相关路由
		articles := api.Group("/articles")
		{
			articles.GET("", handlers.ListArticles)
			articles.GET("/:id", handlers.GetArticle)
			articles.POST("", handlers.CreateArticle)
			articles.PUT("/:id", handlers.UpdateArticle)
			articles.DELETE("/:id", handlers.DeleteArticle)
		}

		// 图片相关路由
		images := api.Group("/images")
		{
			images.GET("", handlers.ListImages)
			images.GET("/:id", handlers.GetImage)
			images.GET("/:id/file", handlers.ServeImage)
			images.POST("", handlers.UploadImage)
			images.DELETE("/:id", handlers.DeleteImage)
		}
	}
}
