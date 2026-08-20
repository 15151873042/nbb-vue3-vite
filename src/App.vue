<template>
  <el-button @click="handleClick">默认按钮</el-button>
</template>

<script setup lang="ts">
import {ElMessage} from 'element-plus'

const handleClick = () => {
  ElMessage.success('1.0.5')
}
</script>

<style scoped>
</style>