<template>
  <!-- 异步组件 -->
  <ComponentA/>
  <ComponentB/>
</template>

<script setup lang="ts">
  import {defineAsyncComponent} from "vue";

  defineOptions({name: 'AsyncComponent'})

  const ComponentA = defineAsyncComponent(() => {
    return import('@/component/ComponentA.vue')
  })


  let ComponentB
  const modules = import.meta.glob('/src/component/*vue')
  for (const path in modules) {
    if (path.includes('B')) {
        ComponentB = defineAsyncComponent(modules[path]);
    }
  }
</script>

<style scoped>

</style>