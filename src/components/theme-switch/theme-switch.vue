<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'

const { isDark, primaryColor, setTheme, setPrimaryColor } = useTheme()

const colors = ['#2b6cff', '#34c759', '#ff9500', '#8a5cf6']
</script>

<template>
  <view class="theme-switch">
    <view class="theme-switch__header">
      <text class="theme-switch__label">{{ $t('common.theme') }}</text>
      <text class="theme-switch__value">
        {{ isDark ? $t('common.dark') : $t('common.light') }}
      </text>
    </view>

    <view class="theme-switch__options">
      <view
        class="theme-switch__option"
        :class="{ 'theme-switch__option--active': !isDark }"
        @click="setTheme('light')"
      >
        {{ $t('common.light') }}
      </view>
      <view
        class="theme-switch__option"
        :class="{ 'theme-switch__option--active': isDark }"
        @click="setTheme('dark')"
      >
        {{ $t('common.dark') }}
      </view>
    </view>

    <view class="theme-switch__colors">
      <view
        v-for="color in colors"
        :key="color"
        class="theme-switch__color"
        :class="{ 'theme-switch__color--active': color === primaryColor }"
        :style="{ backgroundColor: color }"
        @click="setPrimaryColor(color)"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.theme-switch {
  padding: 24rpx;
  background-color: var(--app-color-surface);
  border-radius: var(--app-radius-md);
}

.theme-switch__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.theme-switch__label {
  color: var(--app-color-text);
  font-size: 28rpx;
  font-weight: 600;
}

.theme-switch__value {
  color: var(--app-color-text-secondary);
  font-size: 24rpx;
}

.theme-switch__options {
  display: flex;
  margin-bottom: 20rpx;
}

.theme-switch__option {
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

.theme-switch__option--active {
  border-color: var(--app-color-primary);
  color: var(--app-color-primary);
}

.theme-switch__colors {
  display: flex;
}

.theme-switch__color {
  width: 48rpx;
  height: 48rpx;
  margin-right: 16rpx;
  border-radius: 50%;
  box-sizing: border-box;

  &:last-child {
    margin-right: 0;
  }
}

.theme-switch__color--active {
  border: 4rpx solid var(--app-color-text);
}
</style>
