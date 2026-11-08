import type { OrderItem, PagingParams, PagingResult } from '@/types/api'
import { request } from '@/utils/request'

export function getOrderList(params: PagingParams): Promise<PagingResult<OrderItem>> {
  return request<PagingResult<OrderItem>>({
    url: '/order/list',
    data: params,
  })
}
