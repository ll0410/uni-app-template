import { ref, shallowRef } from 'vue'

export interface UseRequestOptions<T, P extends unknown[]> {
  immediate?: boolean
  defaultParams?: P
  onSuccess?: (data: T, params: P) => void
  onError?: (error: unknown, params: P) => void
}

export function useRequest<T, P extends unknown[] = []>(
  service: (...args: P) => Promise<T>,
  options: UseRequestOptions<T, P> = {},
) {
  const data = shallowRef<T | null>(null)
  const loading = ref(false)
  const error = ref<unknown>(null)
  let lastParams = options.defaultParams

  async function run(...params: P): Promise<T | null> {
    loading.value = true
    error.value = null
    lastParams = params

    try {
      const result = await service(...params)
      data.value = result
      options.onSuccess?.(result, params)
      return result
    } catch (err) {
      error.value = err
      options.onError?.(err, params)
      return null
    } finally {
      loading.value = false
    }
  }

  function refresh(): Promise<T | null> {
    return run(...((lastParams ?? []) as unknown as P))
  }

  if (options.immediate) {
    void run(...((options.defaultParams ?? []) as unknown as P))
  }

  return {
    data,
    loading,
    error,
    run,
    refresh,
  }
}
