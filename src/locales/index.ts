import { createI18n } from 'vue-i18n'

import type { AppLocale } from '@/stores/modules/app'
import { getStorage, STORAGE_KEYS } from '@/utils/storage'

import en from './lang/en.json5'
import zhHans from './lang/zh-Hans.json5'

function resolveLocale(): AppLocale {
  const saved = getStorage<AppLocale>(STORAGE_KEYS.locale)
  if (saved === 'en' || saved === 'zh-Hans') return saved

  try {
    return uni.getLocale().toLowerCase().startsWith('zh') ? 'zh-Hans' : 'en'
  } catch {
    return 'zh-Hans'
  }
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: resolveLocale(),
  fallbackLocale: 'zh-Hans',
  messages: {
    'zh-Hans': zhHans,
    en,
  },
})
