import { computed } from 'vue'

import { useUserStore } from '@/stores/modules/user'

type PermissionInput = string | string[]

function match(source: string[], target: PermissionInput): boolean {
  const values = Array.isArray(target) ? target : [target]
  return values.some((value) => source.includes(value))
}

export function usePermission() {
  const userStore = useUserStore()
  const roles = computed(() => userStore.roles)
  const permissions = computed(() => userStore.permissions)

  const hasRole = (role: PermissionInput): boolean => match(roles.value, role)
  const hasPermission = (permission: PermissionInput): boolean =>
    match(permissions.value, permission)

  return {
    roles,
    permissions,
    hasRole,
    hasPermission,
  }
}
