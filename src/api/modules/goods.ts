import type { GoodsItem, PagingParams, PagingResult } from '@/types/api'
import { request } from '@/utils/request'

export function getGoodsList(params: PagingParams): Promise<PagingResult<GoodsItem>> {
  return request<PagingResult<GoodsItem>>({
    url: '/goods/list',
    data: params,
  })
}
