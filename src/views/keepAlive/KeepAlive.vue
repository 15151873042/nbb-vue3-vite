<template>
  <el-divider>简单keepAlive示例</el-divider>
  <el-button @click="showComponentA = !showComponentA">切换显示组件</el-button>
  <KeepAlive>
    <ComponentA v-if="showComponentA"/>
    <ComponentB v-else/>
  </KeepAlive>


  <el-divider>keepAlive结合路由示例</el-divider>
  <el-button @click="handlePush('/keepAlive/a')">去keepAliveA页面</el-button>
  <el-button @click="handlePush('/keepAlive/b')">去keepAliveB页面</el-button>
  <router-view v-slot="{ Component }">
    <KeepAlive :include="['KeepAliveA']">
      <component :is="Component"/>
    </KeepAlive>
  </router-view>

</template>

<script setup lang="ts">
import ComponentA from "@/component/ComponentA.vue";
import ComponentB from "@/component/ComponentB.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";

defineOptions({name: 'KeepAlive'})

  const showComponentA = ref(true)

  const router = useRouter()

  const handlePush = (str: string) => {
    router.push({path: str})

  }
</script>

<style scoped>

</style>