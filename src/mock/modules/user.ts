import type { MockRequestOptions } from '@/mock'
import type { ApiResponse } from '@/types/api'

import { getMockUserFromHeader, unauthorized } from './auth'

type MockHandler = (options: MockRequestOptions) => ApiResponse<unknown>

export const userMockRoutes: Record<string, MockHandler> = {
  '/user/profile': (options) => {
    const current = getMockUserFromHeader(options.header)

    if (!current) {
      return unauthorized()
    }

    return { code: 0, message: 'ok', data: { ...current.user.info } }
  },
}
