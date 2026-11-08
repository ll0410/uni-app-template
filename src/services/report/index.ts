export interface ReportEvent {
  event: string
  payload?: Record<string, unknown>
}

type Reporter = (data: ReportEvent) => void

let reporter: Reporter | null = null

/** 注入真实上报实现，例如统一发送到埋点平台 */
export function setReporter(handler: Reporter | null): void {
  reporter = handler
}

export function reportEvent(event: string, payload: Record<string, unknown> = {}): void {
  const data: ReportEvent = { event, payload }

  if (reporter) {
    reporter(data)
    return
  }

  if (import.meta.env.DEV) {
    console.info('[report]', event, payload)
  }
}

export function reportError(error: unknown, extra: Record<string, unknown> = {}): void {
  reportEvent('error', {
    ...extra,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  })
}
