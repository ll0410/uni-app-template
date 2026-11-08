<script setup lang="ts">
import { getOrderList } from '@/api/modules/order'
import { usePaging } from '@/hooks/usePaging'
import type { OrderItem, OrderStatus, PagingParams } from '@/types/api'

const { t } = useI18n()

const { list, loading, hasMore, loadMore } = usePaging<OrderItem, PagingParams>({
  service: getOrderList,
  pageSize: 10,
  immediate: true,
})

const statusText: Record<OrderStatus, string> = {
  pending: 'order.statusPending',
  paid: 'order.statusPaid',
  closed: 'order.statusClosed',
}

function getStatusLabel(status: OrderStatus): string {
  return t(statusText[status])
}
</script>

<template>
  <app-page>
    <view class="order">
      <view class="order__header">
        <text class="order__title">{{ $t('order.title') }}</text>
        <text class="order__badge">admin only</text>
      </view>
      <text class="order__hint">{{ $t('order.adminHint') }}</text>

      <view class="order__list">
        <view v-for="item in list" :key="item.id" class="order__item">
          <view class="order__main">
            <text class="order__no">{{ item.orderNo }}</text>
            <text class="order__amount">¥{{ item.amount }}</text>
          </view>
          <text class="order__status" :class="`order__status--${item.status}`">
            {{ getStatusLabel(item.status) }}
          </text>
        </view>
      </view>

      <text v-if="loading && list.length === 0" class="order__tip">{{ $t('common.loading') }}</text>
      <button v-if="hasMore" class="app-button" :disabled="loading" @click="loadMore()">
        {{ $t('goods.loadMore') }}
      </button>
    </view>
  </app-page>
</template>

<style lang="scss" scoped>
.order__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 28rpx 12rpx;
  background-color: var(--app-color-surface);
  border-radius: var(--app-radius-lg) var(--app-radius-lg) 0 0;
}

.order__title {
  color: var(--app-color-text);
  font-size: 32rpx;
  font-weight: 600;
}

.order__badge {
  padding: 4rpx 16rpx;
  background-color: var(--app-color-bg);
  border-radius: 999rpx;
  color: var(--app-color-text-secondary);
  font-size: 22rpx;
}

.order__hint {
  display: block;
  margin-bottom: 24rpx;
  padding: 0 28rpx 24rpx;
  background-color: var(--app-color-surface);
  border-radius: 0 0 var(--app-radius-lg) var(--app-radius-lg);
  color: var(--app-color-text-secondary);
  font-size: 22rpx;
}

.order__list {
  margin-bottom: 24rpx;
  padding: 0 28rpx;
  background-color: var(--app-color-surface);
  border-radius: var(--app-radius-md);
}

.order__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--app-color-border);
}

.order__item:last-child {
  border-bottom: none;
}

.order__main {
  display: flex;
  flex-direction: column;
}

.order__no {
  color: var(--app-color-text);
  font-size: 26rpx;
}

.order__amount {
  margin-top: 4rpx;
  color: var(--app-color-text-secondary);
  font-size: 22rpx;
}

.order__status {
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
}

.order__status--pending {
  background-color: rgb(255 149 0 / 12%);
  color: #ff9500;
}

.order__status--paid {
  background-color: rgb(52 199 89 / 12%);
  color: #34c759;
}

.order__status--closed {
  background-color: var(--app-color-bg);
  color: var(--app-color-text-placeholder);
}

.order__tip {
  display: block;
  margin-bottom: 16rpx;
  color: var(--app-color-text-secondary);
  font-size: 24rpx;
  text-align: center;
}
</style>
