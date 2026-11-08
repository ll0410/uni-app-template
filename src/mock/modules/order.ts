import type { MockRequestOptions } from '@/mock'
import type { ApiResponse, OrderItem, OrderStatus, PagingParams, PagingResult } from '@/types/api'

type MockHandler = (options: MockRequestOptions) => ApiResponse<unknown>

const TOTAL = 12
const STATUS: OrderStatus[] = ['pending', 'paid', 'closed']

export const orderMockRoutes: Record<string, MockHandler> = {
  '/order/list': (options) => {
    const { page = 1, pageSize = 10 } = (options.data ?? {}) as Partial<PagingParams>
    const start = (page - 1) * pageSize
    const end = Math.min(start + pageSize, TOTAL)

    const list: OrderItem[] = Array.from({ length: Math.max(0, end - start) }, (_, index) => {
      const id = start + index + 1
      return {
        id,
        orderNo: `NO20261108${String(id).padStart(4, '0')}`,
        amount: 100 + id * 10,
        status: STATUS[(id - 1) % STATUS.length] as OrderStatus,
      }
    })

    const data: PagingResult<OrderItem> = { list, total: TOTAL }
    return { code: 0, message: 'ok', data }
  },
}
