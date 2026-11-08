import type { MockRequestOptions } from '@/mock'
import type { ApiResponse, GoodsItem, PagingParams, PagingResult } from '@/types/api'

type MockHandler = (options: MockRequestOptions) => ApiResponse<unknown>

const TOTAL = 30

export const goodsMockRoutes: Record<string, MockHandler> = {
  '/goods/list': (options) => {
    const { page = 1, pageSize = 10 } = (options.data ?? {}) as Partial<PagingParams>
    const start = (page - 1) * pageSize
    const end = Math.min(start + pageSize, TOTAL)

    const list: GoodsItem[] = Array.from({ length: Math.max(0, end - start) }, (_, index) => {
      const id = start + index + 1
      return {
        id,
        title: `示例商品 ${id}`,
        price: 100 + id,
      }
    })

    const data: PagingResult<GoodsItem> = { list, total: TOTAL }
    return { code: 0, message: 'ok', data }
  },
}
