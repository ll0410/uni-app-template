import { computed, ref, shallowRef } from 'vue'

import type { PagingResult } from '@/types/api'

export interface UsePagingOptions<T, P extends object> {
  service: (params: P & { page: number; pageSize: number }) => Promise<PagingResult<T>>
  pageSize?: number
  initialParams?: P
  immediate?: boolean
}

export function usePaging<T, P extends object = Record<string, never>>(
  options: UsePagingOptions<T, P>,
) {
  const list = shallowRef<T[]>([])
  const page = ref(1)
  const pageSize = ref(options.pageSize ?? 10)
  const total = ref(0)
  const loading = ref(false)
  const finished = ref(false)
  const error = ref<unknown>(null)
  const hasMore = computed(() => !finished.value)

  async function loadMore(): Promise<void> {
    if (loading.value || finished.value) return

    loading.value = true
    error.value = null

    try {
      const result = await options.service({
        ...(options.initialParams ?? ({} as P)),
        page: page.value,
        pageSize: pageSize.value,
      })

      list.value = [...list.value, ...result.list]
      total.value = result.total

      if (list.value.length >= result.total || result.list.length < pageSize.value) {
        finished.value = true
      } else {
        page.value += 1
      }
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  function reset(): Promise<void> {
    list.value = []
    page.value = 1
    total.value = 0
    finished.value = false
    error.value = null
    return loadMore()
  }

  function refresh(): Promise<void> {
    return reset()
  }

  if (options.immediate) {
    void loadMore()
  }

  return {
    list,
    page,
    pageSize,
    total,
    loading,
    finished,
    hasMore,
    error,
    loadMore,
    reset,
    refresh,
  }
}
