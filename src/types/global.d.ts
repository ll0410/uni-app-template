declare module 'vue' {
  interface ComponentCustomProperties {
    $utils: {
      auth: typeof import('@/utils/auth')
      storage: typeof import('@/utils/storage')
      ui: typeof import('@/utils/ui')
    }
  }
}

export {}
