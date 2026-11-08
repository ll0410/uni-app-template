import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { login as loginApi, logout as logoutApi } from '@/api/modules/auth'
import { getProfile } from '@/api/modules/user'
import type { LoginParams, LoginResult, UserInfo } from '@/types/api'
import { clearAuthStorage, setToken, tokenRef } from '@/utils/auth'

type PermissionInput = string | string[]

function match(source: string[], target: PermissionInput): boolean {
  const values = Array.isArray(target) ? target : [target]
  return values.some((value) => source.includes(value))
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<UserInfo | null>(null)
    const roles = ref<string[]>([])
    const permissions = ref<string[]>([])

    const token = computed(() => tokenRef.value)
    const isLoggedIn = computed(() => Boolean(token.value))

    function hasRole(role: PermissionInput): boolean {
      return match(roles.value, role)
    }

    function hasPermission(permission: PermissionInput): boolean {
      return match(permissions.value, permission)
    }

    function applyUser(info: UserInfo): void {
      userInfo.value = info
      roles.value = [...info.roles]
      permissions.value = [...info.permissions]
    }

    async function login(params: LoginParams): Promise<LoginResult> {
      const result = await loginApi(params)
      setToken(result.accessToken, result.refreshToken)
      applyUser(result.userInfo)
      return result
    }

    async function fetchProfile(): Promise<UserInfo> {
      const info = await getProfile()
      applyUser(info)
      return info
    }

    function reset(): void {
      userInfo.value = null
      roles.value = []
      permissions.value = []
      clearAuthStorage()
    }

    async function logout(): Promise<void> {
      try {
        await logoutApi()
      } catch {
        // 登出接口失败不影响本地清理
      } finally {
        reset()
      }
    }

    return {
      userInfo,
      roles,
      permissions,
      token,
      isLoggedIn,
      hasRole,
      hasPermission,
      login,
      fetchProfile,
      reset,
      logout,
    }
  },
  {
    persist: {
      key: 'uni-app-template:user',
      paths: ['userInfo', 'roles', 'permissions'],
    },
  },
)
