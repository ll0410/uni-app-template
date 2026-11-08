const STORAGE_PREFIX = 'uni-app-template'

export const STORAGE_KEYS = {
  token: `${STORAGE_PREFIX}:token`,
  refreshToken: `${STORAGE_PREFIX}:refresh-token`,
  user: `${STORAGE_PREFIX}:user`,
  appSettings: `${STORAGE_PREFIX}:app-settings`,
  pendingRoute: `${STORAGE_PREFIX}:pending-route`,
  locale: `${STORAGE_PREFIX}:locale`,
  theme: `${STORAGE_PREFIX}:theme`,
} as const

export function getStorage<T>(key: string): T | null {
  try {
    const value = uni.getStorageSync(key)
    return value === '' || value === undefined ? null : (value as T)
  } catch {
    return null
  }
}

export function setStorage<T>(key: string, value: T): void {
  try {
    uni.setStorageSync(key, value)
  } catch (error) {
    console.warn(`[storage] set ${key} failed`, error)
  }
}

export function removeStorage(key: string): void {
  try {
    uni.removeStorageSync(key)
  } catch (error) {
    console.warn(`[storage] remove ${key} failed`, error)
  }
}
