package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"web-app/backend/internal/config"
	"web-app/backend/internal/database"
	"web-app/backend/internal/router"

	"github.com/cloudwego/hertz/pkg/app"
	"github.com/cloudwego/hertz/pkg/app/server"
	"github.com/cloudwego/hertz/pkg/common/hlog"
	"github.com/hertz-contrib/cors"
	zapadapter "github.com/hertz-contrib/logger/zap"
	"go.uber.org/zap"
)

func main() {
	// 初始化配置
	cfg := config.Load()

	// 初始化日志
	logger, err := zap.NewProduction()
	if err != nil {
		log.Fatal("Failed to initialize logger:", err)
	}
	defer logger.Sync()
	hlog.SetLogger(zapadapter.NewLogger(zapadapter.WithZapLogger(logger)))

	// 初始化数据库
	if err := database.Init(cfg); err != nil {
		hlog.Fatalf("Failed to initialize database: %v", err)
	}

	// 创建Hertz服务器
	h := server.Default(
		server.WithHostPorts(cfg.Server.Addr),
		server.WithHandleMethodNotAllowed(true),
	)

	// 配置CORS
	h.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 注册路由
	router.RegisterRoutes(h)

	// 健康检查
	h.GET("/health", func(ctx context.Context, c *app.RequestContext) {
		c.JSON(200, map[string]string{"status": "ok"})
	})

	// 启动服务器
	go func() {
		h.Spin()
	}()

	// 优雅关闭
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	hlog.Info("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := h.Shutdown(ctx); err != nil {
		hlog.Errorf("Server forced to shutdown: %v", err)
	}

	hlog.Info("Server exited")
}
