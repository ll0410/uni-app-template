<script setup lang="ts">
import { platform } from '@/utils/platform'

const appTitle = import.meta.env.VITE_APP_TITLE
const appEnv = import.meta.env.VITE_APP_ENV
const count = ref(0)
const userStore = useUserStore()
const { t } = useI18n()

const countText = computed(() => `${t('home.clickCount')}：${count.value}`)

function increase() {
  count.value += 1
}

function goAuthPage() {
  if (userStore.isLoggedIn) {
    uni.switchTab({ url: '/pages/mine/index' })
    return
  }

  uni.navigateTo({
    url: '/pages/login/index',
  })
}

function goGoods() {
  uni.navigateTo({
    url: '/subPackages/goods/pages/list/index',
  })
}

function goDemo() {
  uni.navigateTo({
    url: '/subPackages/demo/pages/index/index',
  })
}
</script>

<template>
  <app-page>
    <view class="page">
      <view class="hero">
        <view class="logo">U</view>
        <text class="title">{{ appTitle }}</text>
        <text class="subtitle">{{ $t('home.subtitle') }}</text>
      </view>

      <view class="status-card">
        <text class="status-title">
          {{
            userStore.isLoggedIn
              ? $t('home.welcome', { name: userStore.userInfo?.nickname ?? '' })
              : $t('home.notLoggedIn')
          }}
        </text>
        <text v-if="userStore.isLoggedIn" class="status-tip">
          {{ userStore.roles.join(' / ') }}
        </text>
        <text v-else class="status-tip">{{ $t('login.hint') }}</text>
      </view>

      <view class="actions">
        <button class="app-button app-button--primary" @click="goAuthPage">
          {{ userStore.isLoggedIn ? $t('home.profile') : $t('common.login') }}
        </button>
        <button class="app-button action-gap" @click="goGoods">{{ $t('home.goods') }}</button>
        <button class="app-button action-gap" @click="goDemo">{{ $t('home.demo') }}</button>
      </view>

      <view class="settings">
        <view class="settings__item">
          <theme-switch />
        </view>
        <view class="settings__item">
          <lang-switch />
        </view>
      </view>

      <view class="meta">
        <view class="meta__row">
          <text class="meta__label">{{ $t('home.platform') }}</text>
          <text class="meta__value">{{ platform.current }}</text>
        </view>
        <view class="meta__row">
          <text class="meta__label">{{ $t('home.env') }}</text>
          <text class="meta__value">{{ appEnv }}</text>
        </view>
        <view class="meta__row">
          <text class="meta__label">{{ $t('home.packageManager') }}</text>
          <text class="meta__value">pnpm</text>
        </view>
        <view class="meta__row">
          <text class="meta__label">{{ $t('home.autoImport') }}</text>
          <text class="meta__value">{{ countText }}</text>
        </view>
        <button class="app-button meta__button" @click="increase">+1</button>
      </view>
    </view>
  </app-page>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32rpx;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112rpx;
  height: 112rpx;
  margin-bottom: 24rpx;
  background-color: var(--app-color-primary);
  border-radius: 50%;
  color: #fff;
  font-size: 56rpx;
  font-weight: 700;
}

.title {
  display: block;
  color: var(--app-color-text);
  font-size: 44rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}

.subtitle {
  display: block;
  margin-top: 12rpx;
  color: var(--app-color-text-secondary);
  font-size: 26rpx;
  text-align: center;
}

.status-card {
  margin-bottom: 32rpx;
  padding: 32rpx;
  background-color: var(--app-color-surface);
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-shadow-card);
}

.status-title {
  display: block;
  color: var(--app-color-text);
  font-size: 32rpx;
  font-weight: 600;
}

.status-tip {
  display: block;
  margin-top: 8rpx;
  color: var(--app-color-text-secondary);
  font-size: 24rpx;
}

.actions {
  margin-bottom: 32rpx;
}

.action-gap {
  margin-top: 16rpx;
}

.settings {
  margin-bottom: 32rpx;
}

.settings__item + .settings__item {
  margin-top: 16rpx;
}

.meta {
  padding: 8rpx 32rpx 24rpx;
  background-color: var(--app-color-surface);
  border-radius: var(--app-radius-lg);
}

.meta__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--app-color-border);
}

.meta__row:last-of-type {
  border-bottom: none;
}

.meta__label {
  color: var(--app-color-text-secondary);
  font-size: 26rpx;
}

.meta__value {
  color: var(--app-color-text);
  font-size: 28rpx;
  font-weight: 600;
}

.meta__button {
  margin-top: 8rpx;
}
</style>
