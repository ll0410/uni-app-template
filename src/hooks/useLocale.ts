import { computed } from 'vue'

import { i18n } from '@/locales'
import { useAppStore } from '@/stores/modules/app'
import type { AppLocale } from '@/stores/modules/app'

export function useLocale() {
  const appStore = useAppStore()
  const locale = computed(() => appStore.locale)

  function setLocale(value: AppLocale): void {
    appStore.setLocale(value)
    i18n.global.locale.value = value
  }

  function toggleLocale(): void {
    setLocale(locale.value === 'zh-Hans' ? 'en' : 'zh-Hans')
  }

  return {
    locale,
    setLocale,
    toggleLocale,
  }
}
