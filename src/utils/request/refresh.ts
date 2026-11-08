let refreshPromise: Promise<string | null> | null = null

/**
 * 同一时间只允许一个刷新任务，其余调用共享同一个 Promise。
 * 刷新结束后自动释放，下一次 401 可再次触发。
 */
export function runSingleFlightRefresh(task: () => Promise<string | null>): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = task().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}
