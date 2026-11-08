export type RuntimePlatform = 'h5' | 'mp-weixin' | 'app' | 'unknown'

/**
 * 条件编译示例。
 * 注释中的 #ifdef / #ifndef 由 uni-app 在编译阶段处理：
 * 只有当前平台命中的代码会进入产物，其余分支在打包前被移除。
 */
function resolvePlatform(): RuntimePlatform {
  // #ifdef H5
  return 'h5'
  // #endif
  // #ifdef MP-WEIXIN
  return 'mp-weixin'
  // #endif
  // #ifdef APP-PLUS
  return 'app'
  // #endif
  // #ifndef H5 || MP-WEIXIN || APP-PLUS
  return 'unknown'
  // #endif
}

const runtimePlatform: RuntimePlatform = resolvePlatform()

export const platform = {
  current: runtimePlatform,
  isH5: runtimePlatform === 'h5',
  isWeixinMiniProgram: runtimePlatform === 'mp-weixin',
  isApp: runtimePlatform === 'app',
}

export function isPlatform(value: RuntimePlatform): boolean {
  return runtimePlatform === value
}

/**
 * 平台专属分支的返回值同样会被条件编译裁剪。
 * 需要在模板中按平台显示文案时，可参考此函数。
 */
export function getPlatformLabel(): string {
  // #ifdef H5
  return 'H5'
  // #endif
  // #ifdef MP-WEIXIN
  return '微信小程序'
  // #endif
  // #ifdef APP-PLUS
  return 'App'
  // #endif
  // #ifndef H5 || MP-WEIXIN || APP-PLUS
  return '未知平台'
  // #endif
}
