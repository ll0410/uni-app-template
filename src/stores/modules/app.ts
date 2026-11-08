import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getStorage, setStorage, STORAGE_KEYS } from '@/utils/storage'

export type ThemeMode = 'light' | 'dark'
export type AppLocale = 'zh-Hans' | 'en'

function getInitialTheme(): ThemeMode {
  const saved = getStorage<ThemeMode>(STORAGE_KEYS.theme)
  return saved === 'dark' ? 'dark' : 'light'
}

function getInitialLocale(): AppLocale {
  const saved = getStorage<AppLocale>(STORAGE_KEYS.locale)
  if (saved === 'en' || saved === 'zh-Hans') return saved

  try {
    return uni.getLocale().toLowerCase().startsWith('zh') ? 'zh-Hans' : 'en'
  } catch {
    return 'zh-Hans'
  }
}

export const useAppStore = defineStore(
  'app',
  () => {
    const theme = ref<ThemeMode>(getInitialTheme())
    const locale = ref<AppLocale>(getInitialLocale())
    const primaryColor = ref('#2b6cff')

    function setTheme(value: ThemeMode): void {
      theme.value = value
      setStorage(STORAGE_KEYS.theme, value)
    }

    function toggleTheme(): void {
      setTheme(theme.value === 'dark' ? 'light' : 'dark')
    }

    function setLocale(value: AppLocale): void {
      locale.value = value
      setStorage(STORAGE_KEYS.locale, value)
    }

    function setPrimaryColor(value: string): void {
      primaryColor.value = value
    }

    return {
      theme,
      locale,
      primaryColor,
      setTheme,
      toggleTheme,
      setLocale,
      setPrimaryColor,
    }
  },
  {
    persist: {
      key: 'uni-app-template:app',
      paths: ['theme', 'locale', 'primaryColor'],
    },
  },
)
