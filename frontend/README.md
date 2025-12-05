# 个人空间前端项目

一个现代化的个人空间应用，支持发布文章和图片。

## 技术栈

- **React 18** - UI框架
- **Vite** - 构建工具
- **React Router** - 路由管理

## 功能特性

- 📝 发布文章
- 🖼️ 发布图片
- 📱 响应式设计
- 🎨 现代化UI

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
frontend/
├── src/
│   ├── components/      # React组件
│   │   ├── ArticleForm.jsx    # 文章发布表单
│   │   ├── ImageForm.jsx      # 图片发布表单
│   │   └── Feed.jsx           # 动态流
│   ├── App.jsx          # 主应用组件
│   ├── main.jsx         # 入口文件
│   └── *.css            # 样式文件
├── index.html           # HTML模板
├── vite.config.js       # Vite配置
└── package.json         # 项目配置
```

## 注意事项

当前版本使用浏览器本地存储（localStorage）来保存数据，这是临时方案。在实际部署时，需要连接后端API来持久化数据。
