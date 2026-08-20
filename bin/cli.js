#!/usr/bin/env node
// Shebang 声明，指定使用系统环境中的 node 来执行此脚本

// 引入 Node.js 内置的 path 模块，用于处理和转换文件路径
import path from "node:path"
// 引入 fileURLToPath，用于将文件 URL 转换为本地文件路径
import { fileURLToPath } from "node:url"
// 引入 Node.js 内置的 http 模块，用于创建 HTTP 服务器
import { createServer } from "http"
// 引入 Node.js 内置的 fs 模块，用于文件系统操作（读取文件、检查文件是否存在等）
import fs from "node:fs"

// 获取当前文件所在目录的绝对路径
// import.meta.url 返回当前模块的 URL，fileURLToPath 将其转为路径，path.dirname 获取目录名
const __dirname = path.dirname(fileURLToPath(import.meta.url))
// 计算 dist 目录的绝对路径，位于 cli.js 的上级目录中
const distPath = path.resolve(__dirname, "../dist")

// 从命令行参数中读取用户指定的端口号（如 node cli.js 3000）
const rawPort = process.argv[2]
// 默认端口为 5173
let port = 5173
if (rawPort) {
  // 将传入的字符串端口号解析为整数
  const parsed = parseInt(rawPort, 10)
  // 校验端口号是否为有效数字，且在合法范围 1~65535 内
  if (!isNaN(parsed) && parsed > 0 && parsed < 65536) {
    port = parsed
  } else {
    // 端口号无效时输出错误提示，并继续使用默认端口
    console.error(`❌ 无效的端口号: ${rawPort}，使用默认端口 5173`)
  }
}

// MIME 类型映射表，根据文件扩展名返回对应的 Content-Type
// 用于告诉浏览器返回的文件应该用什么方式解析
const mimeTypes = {
  ".html": "text/html",                          // HTML 文档
  ".js": "application/javascript",               // JavaScript 脚本
  ".css": "text/css",                            // CSS 样式表
  ".json": "application/json",                   // JSON 数据
  ".png": "image/png",                           // PNG 图片
  ".jpg": "image/jpeg",                          // JPEG 图片
  ".jpeg": "image/jpeg",                         // JPEG 图片（另一种扩展名）
  ".gif": "image/gif",                           // GIF 图片
  ".svg": "image/svg+xml",                       // SVG 矢量图
  ".ico": "image/x-icon",                        // 网站图标
  ".woff": "font/woff",                          // WOFF 字体
  ".woff2": "font/woff2",                        // WOFF2 字体
  ".ttf": "font/ttf",                            // TrueType 字体
  ".eot": "application/vnd.ms-fontobject",       // Embedded OpenType 字体
}

// 创建 HTTP 服务器，处理所有传入的请求
const server = createServer((req, res) => {
  // 根据请求 URL 拼接出对应的文件路径
  // 如果请求的是根路径 /，则默认返回 index.html
  let filePath = path.join(distPath, req.url === "/" ? "index.html" : req.url)

  // 如果请求的文件不存在（如前端路由的 /about），则回退到 index.html
  // 这是单页应用（SPA）的典型配置，由前端路由接管页面渲染
  if (!fs.existsSync(filePath)) {
    filePath = path.join(distPath, "index.html")
  }

  // 获取文件扩展名并转为小写，用于查找对应的 MIME 类型
  const ext = path.extname(filePath).toLowerCase()
  // 从 mimeTypes 表中查找对应的 Content-Type，找不到则使用二进制流默认值
  const contentType = mimeTypes[ext] || "application/octet-stream"

  // 读取文件内容并响应给客户端
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // 文件读取失败时返回 500 服务器内部错误
      res.writeHead(500)
      res.end(`Server Error: ${err.code}`)
      return
    }
    // 文件读取成功，返回 200 状态码和对应的 Content-Type
    res.writeHead(200, { "Content-Type": contentType })
    res.end(content, "utf-8")
  })
})

// 启动服务器，监听指定的端口
server.listen(port, () => {
  console.log(`🚀 服务已启动: http://localhost:${port}/`)
  console.log(`按 Ctrl+C 停止服务`)
})