/**
 * 小程序更新提示。
 * 微信小程序发布新版本后，用户下次冷启动会触发更新流程，
 * 在 App.vue 的 onLaunch 中调用一次即可。
 */
export function setupMiniProgramUpdate(): void {
  // #ifdef MP-WEIXIN
  const updateManager = uni.getUpdateManager()

  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: '更新提示',
      content: '新版本已准备好，是否重启应用？',
      success: (res) => {
        if (res.confirm) updateManager.applyUpdate()
      },
    })
  })

  updateManager.onUpdateFailed(() => {
    uni.showToast({
      title: '新版本下载失败，请稍后重试',
      icon: 'none',
    })
  })
  // #endif
}

/**
 * App 端升级（热更新 / 整包更新）不在此封装。
 * 需要时可在 HBuilderX 中接入 uni-upgrade-center，
 * 或通过 plus.runtime.getProperty 获取版本后请求升级接口。
 */
export const APP_UPDATE_HINT =
  'App 更新请接入 uni-upgrade-center 或 plus.runtime，模板仅内置小程序更新提示'
