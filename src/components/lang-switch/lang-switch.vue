<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'

const { locale, setLocale } = useLocale()
</script>

<template>
  <view class="lang-switch">
    <text class="lang-switch__label">{{ $t('common.language') }}</text>
    <view class="lang-switch__options">
      <view
        class="lang-switch__option"
        :class="{ 'lang-switch__option--active': locale === 'zh-Hans' }"
        @click="setLocale('zh-Hans')"
      >
        中文
      </view>
      <view
        class="lang-switch__option"
        :class="{ 'lang-switch__option--active': locale === 'en' }"
        @click="setLocale('en')"
      >
        English
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.lang-switch {
  padding: 24rpx;
  background-color: var(--app-color-surface);
  border-radius: var(--app-radius-md);
}

.lang-switch__label {
  display: block;
  margin-bottom: 16rpx;
  color: var(--app-color-text);
  font-size: 28rpx;
  font-weight: 600;
}

.lang-switch__options {
  display: flex;
}

.lang-switch__option {
  flex: 1;
  margin-right: 16rpx;
  padding: 16rpx 0;
  background-color: var(--app-color-bg);
  border: 1rpx solid var(--app-color-border);
  border-radius: var(--app-radius-sm);
  color: var(--app-color-text-secondary);
  font-size: 26rpx;
  text-align: center;

  &:last-child {
    margin-right: 0;
  }
}

.lang-switch__option--active {
  border-color: var(--app-color-primary);
  color: var(--app-color-primary);
}
</style>
