export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar?: string
  roles: string[]
  permissions: string[]
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
  expiresIn: number
  userInfo: UserInfo
}

export interface RefreshTokenResult {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface PagingParams {
  page: number
  pageSize: number
}

export interface PagingResult<T> {
  list: T[]
  total: number
}

export interface GoodsItem {
  id: number
  title: string
  price: number
  cover?: string
}

export type OrderStatus = 'pending' | 'paid' | 'closed'

export interface OrderItem {
  id: number
  orderNo: string
  amount: number
  status: OrderStatus
}
