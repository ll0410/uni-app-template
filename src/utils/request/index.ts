import { isMockEnabled, mockRequest } from '@/mock'
import type { ApiResponse, RefreshTokenResult } from '@/types/api'
import { clearAuthStorage, getRefreshToken, getToken, setToken } from '@/utils/auth'
import { hideLoading, showError, showLoading, sleep } from '@/utils/ui'

import { runSingleFlightRefresh } from './refresh'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface RequestOptions {
  url: string
  method?: HttpMethod
  data?: unknown
  header?: Record<string, string>
  timeout?: number
  /** 是否携带 Authorization，默认 true */
  auth?: boolean
  /** true 显示默认文案，字符串显示自定义文案，false 不显示 */
  loading?: boolean | string
  /** 失败重试次数，仅网络错误与 5xx 会重试 */
  retry?: number
  retryDelay?: number
  /** 相同 key 的新请求会中止上一个请求 */
  cancelKey?: string
  /** 是否统一弹出错误提示，默认 true */
  showError?: boolean
  /** 内部使用：刷新 Token 的请求不再触发刷新，避免递归 */
  skipAuthRefresh?: boolean
}

export class RequestError extends Error {
  readonly code: number

  constructor(message: string, code = -1) {
    super(message)
    this.name = 'RequestError'
    this.code = code
  }
}

const DEFAULT_TIMEOUT = 15000
const pendingTasks = new Map<string, { abort: () => void }>()
const cancelledKeys = new Set<string>()

export function cancelRequest(cancelKey: string): void {
  cancelledKeys.add(cancelKey)
  const task = pendingTasks.get(cancelKey)
  if (task) {
    task.abort()
    pendingTasks.delete(cancelKey)
  }
}

export function cancelAllRequests(): void {
  pendingTasks.forEach((task, key) => {
    cancelledKeys.add(key)
    task.abort()
  })
  pendingTasks.clear()
}

function resolveBaseURL(): string {
  let baseURL = import.meta.env.VITE_API_BASE_URL

  // #ifdef H5
  if (import.meta.env.DEV) {
    baseURL = '/api'
  }
  // #endif

  return baseURL
}

function resolveURL(url: string): string {
  if (/^https?:\/\//.test(url)) return url
  return `${resolveBaseURL()}${url.startsWith('/') ? url : `/${url}`}`
}

function buildHeader(options: RequestOptions): Record<string, string> {
  const header: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.header,
  }

  if (options.auth !== false) {
    const token = getToken()
    if (token) {
      header.Authorization = `Bearer ${token}`
    }
  }

  return header
}

function normalizeResponse<T>(response: UniNamespace.RequestSuccessCallbackResult): ApiResponse<T> {
  const body = response.data as ApiResponse<T> | undefined

  if (response.statusCode === 401) {
    return {
      code: 401,
      message: body?.message || '登录已过期',
      data: null as T,
    }
  }

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new RequestError(body?.message || `HTTP ${response.statusCode}`, response.statusCode)
  }

  if (!body) {
    throw new RequestError('响应数据为空')
  }

  return body
}

function assertNotCancelled(cancelKey?: string): void {
  if (cancelKey && cancelledKeys.has(cancelKey)) {
    throw new RequestError('请求已取消', -2)
  }
}

function sendRaw<T>(
  options: RequestOptions,
  header: Record<string, string>,
): Promise<ApiResponse<T>> {
  if (isMockEnabled()) {
    return mockRequest<T>({ ...options, header })
  }

  return new Promise((resolve, reject) => {
    const task = uni.request({
      url: resolveURL(options.url),
      method: options.method ?? 'GET',
      data: options.data as UniNamespace.RequestOptions['data'],
      header,
      timeout: options.timeout ?? DEFAULT_TIMEOUT,
      success: (response) => {
        try {
          resolve(normalizeResponse<T>(response))
        } catch (error) {
          reject(error)
        }
      },
      fail: (error) => {
        const aborted = error.errMsg.includes('abort')
        reject(
          new RequestError(
            aborted ? '请求已取消' : error.errMsg || '网络请求失败',
            aborted ? -2 : -1,
          ),
        )
      },
      complete: () => {
        if (options.cancelKey) {
          pendingTasks.delete(options.cancelKey)
        }
      },
    })

    if (options.cancelKey) {
      pendingTasks.set(options.cancelKey, task)
    }
  })
}

function isRetryable(error: unknown): boolean {
  return error instanceof RequestError && (error.code === -1 || error.code >= 500)
}

async function sendWithRetry<T>(
  options: RequestOptions,
  header: Record<string, string>,
): Promise<ApiResponse<T>> {
  const retries = Math.max(options.retry ?? 0, 0)
  let attempt = 0

  while (true) {
    try {
      return await sendRaw<T>(options, header)
    } catch (error) {
      if (attempt >= retries || !isRetryable(error)) {
        throw error
      }
      attempt += 1
      await sleep((options.retryDelay ?? 300) * attempt)
    }
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const result = await request<RefreshTokenResult>({
      url: '/auth/refresh',
      method: 'POST',
      data: { refreshToken },
      auth: false,
      showError: false,
      skipAuthRefresh: true,
    })
    setToken(result.accessToken, result.refreshToken)
    return result.accessToken
  } catch {
    return null
  }
}

export async function request<T>(options: RequestOptions): Promise<T> {
  if (options.cancelKey) {
    cancelledKeys.delete(options.cancelKey)
  }

  const loadingText =
    typeof options.loading === 'string'
      ? options.loading
      : options.loading === true
        ? '加载中...'
        : ''

  if (loadingText) {
    showLoading(loadingText)
  }

  try {
    const header = buildHeader(options)
    let response = await sendWithRetry<T>(options, header)
    assertNotCancelled(options.cancelKey)

    if (response.code === 401 && !options.skipAuthRefresh) {
      const newToken = await runSingleFlightRefresh(refreshAccessToken)

      if (!newToken) {
        clearAuthStorage()
        uni.$emit('auth:expired')
        throw new RequestError('登录已过期，请重新登录', 401)
      }

      header.Authorization = `Bearer ${newToken}`
      response = await sendWithRetry<T>(options, header)
      assertNotCancelled(options.cancelKey)
    }

    if (response.code !== 0) {
      throw new RequestError(response.message || '请求失败', response.code)
    }

    return response.data
  } catch (error) {
    if (!(error instanceof RequestError && error.code === -2) && options.showError !== false) {
      showError(error)
    }
    throw error
  } finally {
    if (loadingText) {
      hideLoading()
    }
  }
}
