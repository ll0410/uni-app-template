export type SocketStatus = 'idle' | 'connecting' | 'open' | 'closed'

export interface WebSocketOptions {
  /** 完整 ws/wss 地址 */
  url: string
  protocols?: string[]
  /** 断线自动重连，默认 true */
  reconnect?: boolean
  /** 重连间隔，默认 3000ms */
  reconnectInterval?: number
  /** 最大重连次数，默认 5 */
  maxReconnect?: number
  /** 心跳间隔，未设置则不发送心跳 */
  heartbeatInterval?: number
  /** 心跳内容，默认 ping */
  heartbeatMessage?: string
}

type MessageHandler = (data: string) => void
type StatusHandler = (status: SocketStatus) => void

/**
 * 轻量 WebSocket 客户端，统一封装 uni.connectSocket。
 * 仅处理文本消息；二进制消息请按业务自行转换。
 */
export class WebSocketClient {
  private readonly options: WebSocketOptions
  private task: ReturnType<typeof uni.connectSocket> | null = null
  private messageHandlers = new Set<MessageHandler>()
  private statusHandlers = new Set<StatusHandler>()
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private reconnectCount = 0
  private manualClosed = false
  private status: SocketStatus = 'idle'

  constructor(options: WebSocketOptions) {
    this.options = options
  }

  getStatus(): SocketStatus {
    return this.status
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  onStatus(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler)
    return () => this.statusHandlers.delete(handler)
  }

  connect(): void {
    if (this.status === 'connecting' || this.status === 'open') return

    this.manualClosed = false
    this.setStatus('connecting')

    const task = uni.connectSocket({
      url: this.options.url,
      protocols: this.options.protocols,
      complete: () => {},
    })
    this.task = task

    task.onOpen(() => {
      this.reconnectCount = 0
      this.setStatus('open')
      this.startHeartbeat()
    })

    task.onMessage((res) => {
      if (typeof res.data !== 'string') return
      this.messageHandlers.forEach((handler) => handler(res.data))
    })

    task.onClose(() => {
      this.stopHeartbeat()
      this.task = null
      this.setStatus('closed')
      this.scheduleReconnect()
    })
  }

  send(data: string | Record<string, unknown>): boolean {
    if (!this.task || this.status !== 'open') return false

    const payload = typeof data === 'string' ? data : JSON.stringify(data)
    this.task.send({
      data: payload,
      fail: () => {},
    })
    return true
  }

  close(): void {
    this.manualClosed = true
    this.stopHeartbeat()
    this.clearReconnectTimer()
    this.task?.close({ code: 1000, fail: () => {} })
    this.task = null
    this.setStatus('closed')
  }

  private setStatus(status: SocketStatus): void {
    this.status = status
    this.statusHandlers.forEach((handler) => handler(status))
  }

  private scheduleReconnect(): void {
    if (this.manualClosed) return

    const { reconnect = true, reconnectInterval = 3000, maxReconnect = 5 } = this.options
    if (!reconnect || this.reconnectCount >= maxReconnect) return

    this.reconnectCount += 1
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, reconnectInterval)
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()

    const interval = this.options.heartbeatInterval
    if (!interval) return

    this.heartbeatTimer = setInterval(() => {
      this.send(this.options.heartbeatMessage ?? 'ping')
    }, interval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }
}

export function createWebSocket(options: WebSocketOptions): WebSocketClient {
  return new WebSocketClient(options)
}
