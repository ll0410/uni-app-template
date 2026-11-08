let loadingCount = 0

export function showLoading(title = '加载中...'): void {
  loadingCount += 1
  if (loadingCount === 1) {
    uni.showLoading({ title, mask: true })
  }
}

export function hideLoading(): void {
  if (loadingCount === 0) return
  loadingCount -= 1
  if (loadingCount === 0) {
    uni.hideLoading()
  }
}

export type ToastIcon = 'success' | 'error' | 'none' | 'loading'

export function showToast(title: string, icon: ToastIcon = 'none', duration = 2000): void {
  uni.showToast({ title, icon, duration })
}

export function showError(error: unknown, fallback = '请求失败'): void {
  const message = error instanceof Error && error.message ? error.message : fallback
  showToast(message)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
