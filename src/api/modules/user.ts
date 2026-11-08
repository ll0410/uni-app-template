import type { UserInfo } from '@/types/api'
import { request } from '@/utils/request'

export function getProfile(): Promise<UserInfo> {
  return request<UserInfo>({
    url: '/user/profile',
  })
}
