import { computed } from 'vue'

import { useAppStore } from '@/stores/modules/app'
import type { ThemeMode } from '@/stores/modules/app'

export function useTheme() {
  const appStore = useAppStore()

  const theme = computed(() => appStore.theme)
  const primaryColor = computed(() => appStore.primaryColor)
  const isDark = computed(() => appStore.theme === 'dark')
  const themeClass = computed(() => `theme-${appStore.theme}`)
  const themeStyle = computed<Record<string, string>>(() => ({
    '--app-color-primary': appStore.primaryColor,
  }))

  function applyTheme(): void {
    const dark = isDark.value

    // #ifdef H5
    document.documentElement.classList.toggle('theme-dark', dark)
    document.body.style.backgroundColor = dark ? '#16181d' : '#f7f8fa'
    // #endif

    if (typeof uni.setBackgroundColor === 'function') {
      uni.setBackgroundColor({
        backgroundColor: dark ? '#16181d' : '#f7f8fa',
        backgroundColorTop: dark ? '#16181d' : '#f7f8fa',
        backgroundColorBottom: dark ? '#16181d' : '#f7f8fa',
      })
    }

    if (typeof uni.setNavigationBarColor === 'function') {
      uni.setNavigationBarColor({
        frontColor: dark ? '#ffffff' : '#000000',
        backgroundColor: dark ? '#16181d' : '#ffffff',
        fail: () => {},
      })
    }

    // TabBar 是原生组件，不能通过 CSS 变量换色；仅 TabBar 页面可调用该 API
    if (typeof uni.setTabBarStyle === 'function') {
      uni.setTabBarStyle({
        color: dark ? '#9aa0aa' : '#8a8f99',
        selectedColor: primaryColor.value,
        backgroundColor: dark ? '#16181d' : '#ffffff',
        borderStyle: dark ? 'white' : 'black',
        fail: () => {},
      })
    }
  }

  function setTheme(value: ThemeMode): void {
    appStore.setTheme(value)
    applyTheme()
  }

  function toggleTheme(): void {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  function setPrimaryColor(value: string): void {
    appStore.setPrimaryColor(value)
  }

  return {
    theme,
    primaryColor,
    isDark,
    themeClass,
    themeStyle,
    setTheme,
    toggleTheme,
    setPrimaryColor,
    applyTheme,
  }
}
