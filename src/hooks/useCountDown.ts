import { computed, getCurrentScope, onScopeDispose, ref } from 'vue'

export interface UseCountDownOptions {
  onEnd?: () => void
}

export function useCountDown(initialSeconds = 60, options: UseCountDownOptions = {}) {
  const remaining = ref(initialSeconds)
  const counting = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  function clearTimer(): void {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function stop(): void {
    clearTimer()
    counting.value = false
  }

  function start(seconds = remaining.value): void {
    stop()
    remaining.value = Math.max(0, seconds)
    if (remaining.value === 0) return

    counting.value = true
    timer = setInterval(() => {
      remaining.value -= 1

      if (remaining.value <= 0) {
        stop()
        options.onEnd?.()
      }
    }, 1000)
  }

  function reset(seconds = initialSeconds): void {
    stop()
    remaining.value = Math.max(0, seconds)
  }

  const formatted = computed(() => {
    const minutes = Math.floor(remaining.value / 60)
    const seconds = remaining.value % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  })

  if (getCurrentScope()) {
    onScopeDispose(stop)
  }

  return {
    remaining,
    counting,
    formatted,
    start,
    stop,
    reset,
  }
}
