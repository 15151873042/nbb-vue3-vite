import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
// defineConfig 是 Vite 提供的配置定义函数，传入一个回调函数，接收当前构建模式（mode）作为参数
export default defineConfig(({ mode }) => {
  // loadEnv 根据当前 mode（如 development / production）加载对应的环境变量文件（.env、.env.local 等）
  const env = loadEnv(mode, process.cwd())

  return {
    // plugins 数组用于注册 Vite 插件，扩展构建能力
    plugins: [
      // @vitejs/plugin-vue 插件用于编译 .vue 单文件组件（SFC）
      vue(),
    ],
    // resolve 配置模块解析规则
    resolve: {
      // alias 定义路径别名，简化模块导入路径
      alias: {
        // '@' 指向项目根目录下的 src 文件夹，例如 import '@/components/Foo.vue'
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // server 配置开发服务器行为
    server: {
      // host 设置为 '0.0.0.0' 表示监听所有网络接口，允许局域网其他设备访问
      host: '0.0.0.0',
      // port 设置开发服务器端口，优先从环境变量 VITE_APP_PORT 读取，默认 8080
      port: Number(env.VITE_APP_PORT) || 8080,
      // open 为 true 表示启动服务器后自动在浏览器中打开页面
      open: true,
      // proxy 配置开发服务器的代理规则，用于解决开发环境的跨域问题
      proxy: {
        // 以 /api 开头的请求会被代理
        '/api': {
          // target 指定代理目标地址，从环境变量 VITE_APP_BASE_API 读取后端 API 地址
          target: env.VITE_APP_BASE_API,
          // changeOrigin 为 true 时，会修改请求头中的 host 为目标地址，避免后端校验不通过
          changeOrigin: true,
          // rewrite 重写请求路径，将 /api/xxx 替换为 /xxx，去掉前缀
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})