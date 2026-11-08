import type { ApiResponse } from '@/types/api'
import type { RequestOptions } from '@/utils/request'
import { sleep } from '@/utils/ui'

import { authMockRoutes } from './modules/auth'
import { goodsMockRoutes } from './modules/goods'
import { orderMockRoutes } from './modules/order'
import { userMockRoutes } from './modules/user'

export interface MockRequestOptions extends RequestOptions {
  header?: Record<string, string>
}

type MockHandler = (options: MockRequestOptions) => ApiResponse<unknown>

const routes: Record<string, MockHandler> = {
  ...authMockRoutes,
  ...userMockRoutes,
  ...goodsMockRoutes,
  ...orderMockRoutes,
}

export function isMockEnabled(): boolean {
  return import.meta.env.VITE_USE_MOCK === 'true'
}

export { expireMockAccessToken } from './modules/auth'

export async function mockRequest<T>(options: MockRequestOptions): Promise<ApiResponse<T>> {
  await sleep(300)

  const path = options.url.split('?')[0]
  const handler = routes[path]

  if (!handler) {
    return {
      code: 404,
      message: `Mock 接口未实现：${path}`,
      data: null as T,
    }
  }

  return handler(options) as ApiResponse<T>
}
