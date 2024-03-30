<script setup>
// 引入RouterView使用camel-case
import {RouterView} from 'vue-router'
import useSettingsStore from '@/store/modules/settings'
import {handleThemeStyle} from '@/js/theme'

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
})

</script>

<template>
  <RouterView/>
</template>

<style scoped>

</style>
