<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import { useTheme } from '@/hooks/useTheme'
import { useAppStore } from '@/stores/modules/app'

withDefaults(defineProps<{ padded?: boolean }>(), { padded: true })

const appStore = useAppStore()
const { applyTheme } = useTheme()
const themeClass = computed(() => `theme-${appStore.theme}`)
const themeStyle = computed<Record<string, string>>(() => ({
  '--app-color-primary': appStore.primaryColor,
}))

// App.vue 的 onLaunch 早于页面导航栏创建，这里在页面挂载后同步一次，
// 保证首次加载、刷新以及切换 Tab 后导航栏颜色与当前主题一致。
onMounted(() => {
  applyTheme()
})

watch(
  () => [appStore.theme, appStore.primaryColor],
  () => applyTheme(),
)
</script>

<template>
  <view class="app-page" :class="themeClass" :style="themeStyle">
    <view class="app-page__content" :class="{ 'app-page__content--padded': padded }">
      <slot />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.app-page {
  min-height: 100vh;
  background-color: var(--app-color-bg);
  transition: background-color 0.3s ease;
}

.app-page__content {
  min-height: 100vh;
}

.app-page__content--padded {
  padding: 32rpx;
}
</style>
