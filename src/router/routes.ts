export interface RouteMeta {
  title?: string
  requiresAuth?: boolean
  roles?: string[]
  tabBar?: boolean
}

export const routeMeta: Record<string, RouteMeta> = {
  '/pages/index/index': {
    title: '首页',
    requiresAuth: false,
    tabBar: true,
  },
  '/pages/login/index': {
    title: '登录',
    requiresAuth: false,
  },
  '/pages/mine/index': {
    title: '我的',
    requiresAuth: true,
    tabBar: true,
  },
  '/subPackages/goods/pages/list/index': {
    title: '商品列表',
    requiresAuth: true,
  },
  '/subPackages/order/pages/list/index': {
    title: '订单列表',
    requiresAuth: true,
    roles: ['admin'],
  },
  '/subPackages/demo/pages/index/index': {
    title: '能力演示',
    requiresAuth: true,
  },
}

export function normalizePath(url: string): string {
  const path = url.split('?')[0] ?? ''
  return path.startsWith('/') ? path : `/${path}`
}

export function getRouteMeta(url: string): RouteMeta | undefined {
  return routeMeta[normalizePath(url)]
}
