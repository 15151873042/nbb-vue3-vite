import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/sse',
      name: 'SSE',
      meta: {
        description: 'SSE 示例页面'
      },
      component: () => import('../views/SSE.vue')
    }
  ]
})

export default router