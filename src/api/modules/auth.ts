import type { LoginParams, LoginResult } from '@/types/api'
import { request } from '@/utils/request'

export function login(params: LoginParams): Promise<LoginResult> {
  return request<LoginResult>({
    url: '/auth/login',
    method: 'POST',
    data: params,
    auth: false,
  })
}

export function logout(): Promise<void> {
  return request<void>({
    url: '/auth/logout',
    method: 'POST',
  })
}
