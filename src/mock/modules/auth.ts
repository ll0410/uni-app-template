import type { MockRequestOptions } from '@/mock'
import type { ApiResponse, LoginResult, RefreshTokenResult, UserInfo } from '@/types/api'
import { getRefreshToken, setToken } from '@/utils/auth'

interface MockUser {
  password: string
  info: UserInfo
}

const ACCESS_TOKEN_TTL = 2 * 60 * 60 * 1000
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000

const MOCK_USERS: Record<string, MockUser> = {
  admin: {
    password: '123456',
    info: {
      id: '1',
      username: 'admin',
      nickname: '管理员',
      roles: ['admin'],
      permissions: ['user:edit', 'order:view'],
    },
  },
  user: {
    password: '123456',
    info: {
      id: '2',
      username: 'user',
      nickname: '普通用户',
      roles: ['user'],
      permissions: ['order:view'],
    },
  },
}

interface MockTokenPayload {
  kind: 'access' | 'refresh'
  username: string
  expiresAt: number
}

function createAccessToken(username: string, ttl = ACCESS_TOKEN_TTL): string {
  return `mock.access.${username}.${Date.now() + ttl}`
}

function createRefreshToken(username: string, ttl = REFRESH_TOKEN_TTL): string {
  return `mock.refresh.${username}.${Date.now() + ttl}`
}

function parseMockToken(token: string): MockTokenPayload | null {
  const [prefix, kind, username, expiresAt] = token.split('.')
  if (prefix !== 'mock' || (kind !== 'access' && kind !== 'refresh')) return null

  const timestamp = Number(expiresAt)
  if (!username || Number.isNaN(timestamp)) return null

  return { kind, username, expiresAt: timestamp }
}

export function getMockUserFromHeader(
  header?: Record<string, string>,
): { username: string; user: MockUser } | null {
  const token = (header?.Authorization ?? '').replace(/^Bearer\s+/i, '')
  const payload = parseMockToken(token)

  if (!payload || payload.kind !== 'access' || payload.expiresAt <= Date.now()) {
    return null
  }

  const user = MOCK_USERS[payload.username]
  return user ? { username: payload.username, user } : null
}

export function unauthorized<T>(): ApiResponse<T> {
  return { code: 401, message: '登录已过期', data: null as T }
}

/** 演示用：把本地 accessToken 改成已过期，下一次请求会触发无感刷新 */
export function expireMockAccessToken(): void {
  const refreshToken = getRefreshToken()
  const payload = parseMockToken(refreshToken)
  const username = payload?.username ?? 'admin'
  setToken(createAccessToken(username, -1000), refreshToken)
}

export const authMockRoutes: Record<string, MockHandler> = {
  '/auth/login': (options) => {
    const { username, password } = (options.data ?? {}) as {
      username?: string
      password?: string
    }
    const user = username ? MOCK_USERS[username] : undefined

    if (!user || user.password !== password) {
      return { code: 1001, message: '账号或密码错误', data: null }
    }

    const data: LoginResult = {
      accessToken: createAccessToken(username as string),
      refreshToken: createRefreshToken(username as string),
      expiresIn: ACCESS_TOKEN_TTL / 1000,
      userInfo: { ...user.info },
    }

    return { code: 0, message: 'ok', data }
  },
  '/auth/refresh': (options) => {
    const { refreshToken } = (options.data ?? {}) as { refreshToken?: string }
    const payload = refreshToken ? parseMockToken(refreshToken) : null

    if (!payload || payload.kind !== 'refresh' || payload.expiresAt <= Date.now()) {
      return { code: 401, message: '刷新凭证已过期', data: null }
    }

    const data: RefreshTokenResult = {
      accessToken: createAccessToken(payload.username),
      refreshToken: createRefreshToken(payload.username),
      expiresIn: ACCESS_TOKEN_TTL / 1000,
    }

    return { code: 0, message: 'ok', data }
  },
  '/auth/logout': () => ({ code: 0, message: 'ok', data: null }),
}

type MockHandler = (options: MockRequestOptions) => ApiResponse<unknown>
