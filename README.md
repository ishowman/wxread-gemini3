# BookMarked - Next.js Fullstack Edition

BookMarked 是一个全栈书单管理应用，使用 Next.js 构建，支持 Neon Serverless Postgres 和 Drizzle ORM。

## ✨ 核心特性：智能双模式

本项目内置了**智能数据库模式**，确保你在任何环境下都能立即运行：

1.  **Mock 演示模式**：
    *   **何时触发**：未检测到 `DATABASE_URL` 环境变量时。
    *   **行为**：使用内存数据库。数据在应用重启后重置。
    *   **适用场景**：快速预览 (Preview)、本地无数据库测试。

2.  **生产模式 (Neon + Drizzle)**：
    *   **何时触发**：`.env` 或环境变量中存在 `DATABASE_URL`。
    *   **行为**：连接真实的 Postgres 数据库，数据持久化存储。
    *   **适用场景**：真实部署、数据持久化。

## 🚀 快速开始

只需一行命令即可启动整个全栈应用（包含 API 和 前端）：

```bash
npm install
npm run dev
```

打开浏览器访问 `http://localhost:3000`。

## 🔌 连接真实数据库 (可选)

如果你想持久化保存数据，请按照以下步骤连接 Neon：

1.  在 [Neon](https://neon.tech) 创建项目，获取连接字符串。
2.  在项目根目录创建 `.env.local` 文件：
    ```env
    DATABASE_URL="postgres://..."
    ```
3.  应用会自动检测并切换到生产模式。

## 🛠 技术栈

- **框架**: Next.js 14 (App Router)
- **数据库**: Neon Serverless Postgres (或内存 Mock)
- **ORM**: Drizzle ORM
- **样式**: Tailwind CSS