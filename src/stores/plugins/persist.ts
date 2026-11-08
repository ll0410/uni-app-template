/**
 * pinia-plugin-persistedstate 的 uni storage 适配器。
 * 小程序 / APP / H5 均使用 uni.getStorageSync 系列 API。
 */
export const uniStorage = {
  getItem: (key: string): string | null => {
    const value = uni.getStorageSync(key)
    return typeof value === 'string' && value ? value : null
  },
  setItem: (key: string, value: string): void => {
    uni.setStorageSync(key, value)
  },
  removeItem: (key: string): void => {
    uni.removeStorageSync(key)
  },
}
