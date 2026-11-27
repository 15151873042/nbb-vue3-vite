<template>
  <p>ComponentA</p>
</template>

<script setup lang="ts">
import {onActivated, onDeactivated, onMounted, onUnmounted} from "vue";

defineOptions({name: 'ComponentA'})

  onMounted(() => {
    console.log('ComponentA onMounted')
  })
  onUnmounted(() => {
    console.log('ComponentA onUnmounted')
  })
  onActivated(() => {
    console.log('ComponentA onActivated')
  })
  onDeactivated(() => {
    console.log('ComponentA onDeactivated')
  })
</script>

<style scoped>

</style>