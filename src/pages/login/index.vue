<script setup lang="ts">
import { getRouteMeta } from '@/router/routes'
import { getStorage, removeStorage, STORAGE_KEYS } from '@/utils/storage'
import { showToast } from '@/utils/ui'

const userStore = useUserStore()
const { t } = useI18n()
const username = ref('admin')
const password = ref('123456')
const loading = ref(false)
const redirect = ref('')

onLoad((query) => {
  const params = query as Record<string, string> | undefined
  const fromQuery = params?.redirect
  const pending = getStorage<string>(STORAGE_KEYS.pendingRoute)
  redirect.value = fromQuery ? decodeURIComponent(fromQuery) : (pending ?? '')
  removeStorage(STORAGE_KEYS.pendingRoute)
})

function quickFill(type: 'admin' | 'user') {
  username.value = type
  password.value = '123456'
}

async function handleLogin() {
  if (!username.value.trim() || !password.value.trim()) {
    showToast(t('login.required'))
    return
  }

  loading.value = true

  try {
    await userStore.login({
      username: username.value.trim(),
      password: password.value.trim(),
    })
    showToast(t('common.success'), 'success')

    const target = redirect.value || '/pages/mine/index'
    const path = target.split('?')[0] ?? ''

    if (getRouteMeta(path)?.tabBar) {
      uni.switchTab({ url: path })
    } else {
      uni.redirectTo({ url: target })
    }
  } catch {
    // 请求层已统一提示
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <app-page>
    <view class="login">
      <view class="login__hero">
        <text class="login__title">{{ $t('login.title') }}</text>
        <text class="login__subtitle">{{ $t('home.subtitle') }}</text>
      </view>

      <view class="login__form">
        <view class="field">
          <text class="field__label">{{ $t('login.username') }}</text>
          <input
            v-model="username"
            class="field__input"
            :placeholder="$t('login.usernamePlaceholder')"
            maxlength="20"
          />
        </view>

        <view class="field">
          <text class="field__label">{{ $t('login.password') }}</text>
          <input
            v-model="password"
            class="field__input"
            password
            :placeholder="$t('login.passwordPlaceholder')"
            maxlength="20"
            confirm-type="done"
            @confirm="handleLogin"
          />
        </view>

        <view class="quick">
          <view class="quick__chip" @click="quickFill('admin')">
            {{ $t('login.quickAdmin') }}
          </view>
          <view class="quick__chip" @click="quickFill('user')">
            {{ $t('login.quickUser') }}
          </view>
        </view>

        <button
          class="app-button app-button--primary login__submit"
          :disabled="loading"
          @click="handleLogin"
        >
          {{ loading ? $t('login.loggingIn') : $t('login.submit') }}
        </button>

        <text class="login__hint">{{ $t('login.hint') }}</text>
      </view>
    </view>
  </app-page>
</template>

<style lang="scss" scoped>
.login__hero {
  margin-bottom: 48rpx;
  text-align: center;
}

.login__title {
  display: block;
  color: var(--app-color-text);
  font-size: 40rpx;
  font-weight: 700;
}

.login__subtitle {
  display: block;
  margin-top: 8rpx;
  color: var(--app-color-text-secondary);
  font-size: 24rpx;
}

.login__form {
  padding: 32rpx;
  background-color: var(--app-color-surface);
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-shadow-card);
}

.field {
  margin-bottom: 24rpx;
}

.field__label {
  display: block;
  margin-bottom: 12rpx;
  color: var(--app-color-text-secondary);
  font-size: 26rpx;
}

.field__input {
  width: 100%;
  height: 88rpx;
  padding: 0 24rpx;
  background-color: var(--app-color-bg);
  border: 1rpx solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  color: var(--app-color-text);
  font-size: 28rpx;
}

.quick {
  display: flex;
  margin-bottom: 32rpx;
}

.quick__chip {
  margin-right: 16rpx;
  padding: 12rpx 24rpx;
  background-color: var(--app-color-bg);
  border: 1rpx solid var(--app-color-border);
  border-radius: 999rpx;
  color: var(--app-color-text-secondary);
  font-size: 24rpx;

  &:last-child {
    margin-right: 0;
  }
}

.login__submit {
  margin-top: 8rpx;
}

.login__hint {
  display: block;
  margin-top: 24rpx;
  color: var(--app-color-text-placeholder);
  font-size: 24rpx;
  text-align: center;
}
</style>
