<template>
  <div>
    <el-button @click="cleanup">主动断开</el-button>
  </div>
</template>

<script setup lang="ts">

import {fetchEventSource} from "@microsoft/fetch-event-source";
import {onMounted, onUnmounted} from "vue";

// 用于主动中断 fetchEventSource 连接的控制器
let ctrl: AbortController | null = null

// 重连定时器，控制断开后多久重新连接
let reconnectTimer: ReturnType<typeof setTimeout> | null = null

// 心跳超时定时器，用于检测连接是否已死
let heartbeatTimer: ReturnType<typeof setTimeout> | null = null

// 心跳超时时间（毫秒）：15秒内没收到任何消息就认为连接已死
// 需要根据服务端实际发送频率调整，如果服务端发送间隔较长可适当调大
const HEARTBEAT_TIMEOUT = 15000

/**
 * 清理所有资源：
 * 1. 中断当前正在进行的 SSE 连接
 * 2. 取消重连定时器，防止重复重连
 * 3. 取消心跳超时定时器
 */
const cleanup = () => {
  ctrl?.abort()
  ctrl = null
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (heartbeatTimer) {
    clearTimeout(heartbeatTimer)
    heartbeatTimer = null
  }
}

/**
 * 重置心跳超时检测：
 * 每次收到消息时调用，重新开始 15 秒倒计时。
 * 如果 15 秒内没有收到任何消息，说明连接可能已经死了（比如服务端进程被杀），
 * 此时主动断开并触发重连。
 *
 * 为什么需要这个：
 * fetchEventSource 在服务端异常断开时（如进程被杀），不会触发 onerror 和 onclose，
 * 会一直挂起等待。心跳超时就是为了在这种场景下主动"拔线"。
 */
const resetHeartbeat = () => {
  // 取消之前的心跳定时器，避免多个定时器同时存在
  if (heartbeatTimer) {
    clearTimeout(heartbeatTimer)
  }
  // 启动新的心跳定时器
  heartbeatTimer = setTimeout(() => {
    console.log('心跳超时，主动断开重连')
    cleanup()
    reconnectTimer = setTimeout(connect, 3000)
  }, HEARTBEAT_TIMEOUT)
}

/**
 * 建立 SSE 连接：
 * 1. 先清理之前的连接和定时器，防止重复
 * 2. 创建新的 AbortController，用于后续主动中断
 * 3. 启动心跳超时检测
 * 4. 调用 fetchEventSource 建立连接
 */
const connect = () => {
  cleanup()
  ctrl = new AbortController()
  resetHeartbeat()

  fetchEventSource('/api/sse/time', {
    // 传入 AbortController 的信号，让心跳超时能主动中断连接
    signal: ctrl.signal,
    async onopen() {
      console.log('SSE连接成功')
    },
    onmessage(event) {
      console.log('收到', event.data)
      // 每收到一条消息就重置心跳定时器，说明连接还活着
      resetHeartbeat()
    },
    onclose() {
      console.log('SSE连接关闭，3秒后重连...')
      cleanup()
      reconnectTimer = setTimeout(connect, 3000)
    },
    onerror(err) {
      console.error('SSE error', err)
      cleanup()
      reconnectTimer = setTimeout(connect, 3000)
      // 返回非 undefined 阻止库默认重连行为，我们自己控制重连逻辑
      return null
    }
  })
}

// 组件挂载时开始连接
onMounted(() => {
  connect()
})

// 组件卸载时清理所有资源，防止内存泄漏和后台继续重连
onUnmounted(() => {
  cleanup()
})

</script>

<style scoped>
</style>