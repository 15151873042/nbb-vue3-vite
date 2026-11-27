import {createRouter, createWebHistory} from 'vue-router'

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
    },
    {
      path: '/asyncComponent',
      name: 'asyncComponent',
      meta: {
        description: '异步组件'
      },
      component: () => import('../views/AsyncComponent.vue')
    },
    {
      path: '/dynamicComponent',
      name: 'dynamicComponent',
      meta: {
        description: '动态组件'
      },
      component: () => import('../views/DynamicComponent.vue')
    },
    {
      path: '/keepAlive',
      name: 'keepAlive',
      meta: {
        description: '缓存组件'
      },
      component: () => import('../views/keepAlive/KeepAlive.vue'),
      children: [
        {
          path: 'a',
          component: () => import('../views/keepAlive/A.vue')
        },
        {
          path: 'b',
          component: () => import('../views/keepAlive/B.vue')
        }
      ]
    },
  ]
})

export default router