# 个人空间后端服务

基于 Go 和 Hertz 框架构建的个人空间后端服务，支持文章发布和图片上传功能。

## 功能特性

- 📝 文章管理：创建、查看、更新、删除文章
- 🖼️ 图片管理：上传、查看、删除图片
- 🗄️ 数据持久化：使用 SQLite 数据库存储数据
- 🔒 CORS 支持：跨域资源共享配置
- 📊 日志记录：使用 Zap 进行结构化日志记录

## 技术栈

- **语言**: Go 1.21+
- **Web框架**: CloudWeGo Hertz
- **数据库**: SQLite (通过 GORM)
- **日志**: Zap

## 项目结构

```
backend/
├── main.go              # 应用入口
├── cmd/                 # 应用程序入口
│   └── server/
│       └── main.go      # 服务器主程序
├── internal/            # 私有应用程序代码
│   ├── config/          # 配置管理
│   │   └── config.go
│   ├── database/        # 数据库初始化
│   │   └── database.go
│   ├── models/          # 数据模型
│   │   ├── article.go
│   │   └── image.go
│   ├── handlers/        # 请求处理器
│   │   ├── article.go
│   │   └── image.go
│   └── router/          # 路由配置
│       └── router.go
├── pkg/                 # 可被外部应用使用的库代码（可选）
└── go.mod               # Go 模块定义
```

## 快速开始

### 1. 安装依赖

```bash
cd backend
go mod download
```

### 2. 运行服务

```bash
go run main.go
```

服务默认运行在 `:8080` 端口。

### 3. 环境变量配置（可选）

可以通过环境变量自定义配置：

```bash
export SERVER_ADDR=:8080        # 服务器地址
export DB_TYPE=sqlite           # 数据库类型
export DB_PATH=./data.db        # 数据库路径
export UPLOAD_DIR=./uploads     # 上传文件目录
```

## API 文档

### 健康检查

```
GET /health
```

### 文章 API

#### 获取文章列表
```
GET /api/articles
```

#### 获取单篇文章
```
GET /api/articles/:id
```

#### 创建文章
```
POST /api/articles
Content-Type: application/json

{
  "title": "文章标题",
  "content": "文章内容"
}
```

#### 更新文章
```
PUT /api/articles/:id
Content-Type: application/json

{
  "title": "新标题",
  "content": "新内容"
}
```

#### 删除文章
```
DELETE /api/articles/:id
```

### 图片 API

#### 获取图片列表
```
GET /api/images
```

#### 获取图片信息
```
GET /api/images/:id
```

#### 获取图片文件
```
GET /api/images/:id/file
```

#### 上传图片
```
POST /api/images
Content-Type: multipart/form-data

image: [文件]
```

支持的图片格式：`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
最大文件大小：10MB

#### 删除图片
```
DELETE /api/images/:id
```

## 开发

### 构建

```bash
go build -o bin/server main.go
```

### 运行测试

```bash
go test ./...
```

## 注意事项

- 上传的图片文件会保存在 `./uploads` 目录（可通过环境变量配置）
- 数据库文件默认保存在 `./data.db`（可通过环境变量配置）
- 建议在生产环境中配置适当的 CORS 策略
- 建议添加身份验证和授权机制

## 许可证

MIT
