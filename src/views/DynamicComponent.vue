<template>
  <!-- 动态组件组件 -->
  <el-button v-for="(tab, index) in tabs" :key="index" @click="currentTab = tab">
    {{ index }}
  </el-button>
  <component :is="currentTab"></component>
</template>

<script setup lang="ts">
import {defineAsyncComponent, ref} from "vue";
  defineOptions({name: 'DynamicComponent'})

  import ComponentA from '@/component/ComponentA.vue'

  let tabs = [ComponentA]
  // currentTab 必须是 ref，否则点击按钮模板不会更新
  const currentTab = ref(tabs[0])
  const modules = import.meta.glob('@/component/Component[BC].vue')
  // defineAsyncComponent 是同步返回组件包装器，不需要（也不能）await
  for (const [path, loader] of Object.entries(modules)) {
    const c = defineAsyncComponent(loader)
    tabs.push(c)
  }

</script>

<style scoped>

</style>