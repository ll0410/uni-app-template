import { ref } from 'vue'

import { getStorage, removeStorage, setStorage, STORAGE_KEYS } from './storage'

const tokenRef = ref<string>(getStorage<string>(STORAGE_KEYS.token) ?? '')
const refreshTokenRef = ref<string>(getStorage<string>(STORAGE_KEYS.refreshToken) ?? '')

export { refreshTokenRef, tokenRef }

export function getToken(): string {
  return tokenRef.value
}

export function getRefreshToken(): string {
  return refreshTokenRef.value
}

export function setToken(accessToken: string, refreshToken?: string): void {
  tokenRef.value = accessToken
  setStorage(STORAGE_KEYS.token, accessToken)

  if (refreshToken !== undefined) {
    refreshTokenRef.value = refreshToken
    setStorage(STORAGE_KEYS.refreshToken, refreshToken)
  }
}

export function clearAuthStorage(): void {
  tokenRef.value = ''
  refreshTokenRef.value = ''
  removeStorage(STORAGE_KEYS.token)
  removeStorage(STORAGE_KEYS.refreshToken)
}
