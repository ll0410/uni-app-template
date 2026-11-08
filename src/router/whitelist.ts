export const LOGIN_PATH = '/pages/login/index'

/**
 * 无需登录即可访问的页面。
 * 新增公开页时，同时补充 routes.ts 的 meta，便于统一维护。
 */
export const LOGIN_WHITELIST = [LOGIN_PATH, '/pages/index/index']
