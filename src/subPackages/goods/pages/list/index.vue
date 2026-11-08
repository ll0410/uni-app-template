<script setup lang="ts">
import { getGoodsList } from '@/api/modules/goods'
import { usePaging } from '@/hooks/usePaging'
import type { GoodsItem, PagingParams } from '@/types/api'

const { list, loading, hasMore, loadMore, refresh } = usePaging<GoodsItem, PagingParams>({
  service: getGoodsList,
  pageSize: 10,
  immediate: true,
})
</script>

<template>
  <app-page>
    <view class="goods">
      <view class="goods__header">
        <text class="goods__title">{{ $t('goods.title') }}</text>
        <text class="goods__badge">subPackages/goods</text>
      </view>

      <view class="goods__list">
        <view v-for="item in list" :key="item.id" class="goods__item">
          <view class="goods__main">
            <text class="goods__name">{{ item.title }}</text>
            <text class="goods__id">ID: {{ item.id }}</text>
          </view>
          <text class="goods__price">¥{{ item.price }}</text>
        </view>
      </view>

      <text v-if="loading && list.length === 0" class="goods__tip">{{ $t('common.loading') }}</text>

      <button v-if="hasMore" class="app-button" :disabled="loading" @click="loadMore()">
        {{ $t('goods.loadMore') }}
      </button>
      <button v-else class="app-button" @click="refresh()">{{ $t('goods.reload') }}</button>
    </view>
  </app-page>
</template>

<style lang="scss" scoped>
.goods__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  padding: 28rpx;
  background-color: var(--app-color-surface);
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-shadow-card);
}

.goods__title {
  color: var(--app-color-text);
  font-size: 32rpx;
  font-weight: 600;
}

.goods__badge {
  padding: 4rpx 16rpx;
  background-color: var(--app-color-bg);
  border-radius: 999rpx;
  color: var(--app-color-text-secondary);
  font-size: 22rpx;
}

.goods__list {
  margin-bottom: 24rpx;
  padding: 0 28rpx;
  background-color: var(--app-color-surface);
  border-radius: var(--app-radius-md);
}

.goods__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--app-color-border);
}

.goods__item:last-child {
  border-bottom: none;
}

.goods__main {
  display: flex;
  flex-direction: column;
}

.goods__name {
  color: var(--app-color-text);
  font-size: 28rpx;
}

.goods__id {
  margin-top: 4rpx;
  color: var(--app-color-text-placeholder);
  font-size: 22rpx;
}

.goods__price {
  color: var(--app-color-primary);
  font-size: 28rpx;
  font-weight: 600;
}

.goods__tip {
  display: block;
  margin-bottom: 16rpx;
  color: var(--app-color-text-secondary);
  font-size: 24rpx;
  text-align: center;
}
</style>
