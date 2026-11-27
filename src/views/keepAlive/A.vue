<template>
  <h1>KeepAliveA</h1>
</template>

<script setup lang="ts">
import {onActivated, onDeactivated, onMounted, onUnmounted} from "vue";

  defineOptions({name: 'KeepAliveA'})

  onMounted(() => {
  console.log('KeepAliveA onMounted')
  })

  onActivated(() => {
    console.log('KeepAliveA onActivated')
  })

  onDeactivated(() => {
    console.log('KeepAliveA onDeactivated')
  })

  onUnmounted(() => {
  console.log('KeepAliveA onUnmounted')
})
</script>

<style scoped>

</style>