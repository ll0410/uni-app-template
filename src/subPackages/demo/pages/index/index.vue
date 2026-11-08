<script setup lang="ts">
import { getGoodsList } from '@/api/modules/goods'
import { getProfile } from '@/api/modules/user'
import { useCountDown } from '@/hooks/useCountDown'
import { usePaging } from '@/hooks/usePaging'
import { usePermission } from '@/hooks/usePermission'
import { useRequest } from '@/hooks/useRequest'
import { expireMockAccessToken, isMockEnabled } from '@/mock'
import type { GoodsItem, PagingParams } from '@/types/api'
import { cancelRequest, request } from '@/utils/request'
import { showToast } from '@/utils/ui'

const { t } = useI18n()
const { hasRole } = usePermission()
const isAdmin = computed(() => hasRole('admin'))

const { data: profile, loading: profileLoading, run: loadProfile } = useRequest(getProfile)

const {
  list: goodsList,
  loading: goodsLoading,
  hasMore: goodsHasMore,
  loadMore,
} = usePaging<GoodsItem, PagingParams>({
  service: getGoodsList,
  pageSize: 10,
  immediate: true,
})

const {
  formatted: countdownText,
  counting,
  start: startCountdown,
  reset: resetCountdown,
} = useCountDown(10)

const cancelStatus = ref<'idle' | 'loading' | 'done' | 'cancelled'>('idle')
const refreshStatus = ref('')
const refreshing = ref(false)

const cancelText = computed(() => {
  const textMap = {
    idle: t('demo.cancelIdle'),
    loading: t('demo.cancelLoading'),
    done: t('demo.cancelDone'),
    cancelled: t('demo.cancelCancelled'),
  }

  return textMap[cancelStatus.value]
})

async function startCancelableRequest() {
  cancelStatus.value = 'loading'

  try {
    await request({ url: '/user/profile', cancelKey: 'demo-cancel' })
    cancelStatus.value = 'done'
  } catch {
    cancelStatus.value = 'cancelled'
  }
}

function cancelPendingRequest() {
  cancelRequest('demo-cancel')
}

async function demoConcurrentRefresh() {
  if (!isMockEnabled()) {
    showToast(t('demo.mockOnly'))
    return
  }

  refreshing.value = true
  refreshStatus.value = ''

  try {
    expireMockAccessToken()

    await Promise.all([
      request({ url: '/user/profile', showError: false }),
      request({ url: '/user/profile', showError: false }),
      request({ url: '/user/profile', showError: false }),
    ])

    refreshStatus.value = t('demo.refreshDone')
  } catch (error) {
    refreshStatus.value =
      error instanceof Error && error.message ? error.message : t('demo.refreshFailed')
  } finally {
    refreshing.value = false
  }
}
</script>

<template>
  <app-page>
    <view class="demo">
      <view class="card">
        <view class="card__header">
          <text class="card__title">{{ $t('demo.request') }}</text>
          <text class="card__badge">GET /user/profile</text>
        </view>
        <button class="app-button" @click="loadProfile()">
          {{ $t('demo.loadProfile') }}
        </button>
        <text v-if="profileLoading" class="result">{{ $t('common.loading') }}</text>
        <view v-else-if="profile" class="result">
          <text class="result__line">{{ profile.nickname }} / @{{ profile.username }}</text>
          <text class="result__line">roles: {{ profile.roles.join(', ') }}</text>
        </view>
      </view>

      <view class="card">
        <view class="card__header">
          <text class="card__title">{{ $t('demo.paging') }}</text>
          <text class="card__badge">GET /goods/list</text>
        </view>
        <view class="goods">
          <view v-for="item in goodsList" :key="item.id" class="goods__item">
            <text class="goods__title">{{ item.title }}</text>
            <text class="goods__price">¥{{ item.price }}</text>
          </view>
        </view>
        <text v-if="goodsList.length === 0 && goodsLoading" class="result">
          {{ $t('common.loading') }}
        </text>
        <button v-if="goodsHasMore" class="app-button" :disabled="goodsLoading" @click="loadMore()">
          {{ $t('demo.loadMore') }}
        </button>
        <text v-else class="result">{{ $t('demo.noMore') }}</text>
      </view>

      <view class="card">
        <view class="card__header">
          <text class="card__title">{{ $t('demo.countdown') }}</text>
          <text class="card__badge">10s</text>
        </view>
        <text class="countdown__value">{{ countdownText }}</text>
        <view class="row">
          <button class="app-button" :disabled="counting" @click="startCountdown(10)">
            {{ $t('demo.startCountdown') }}
          </button>
          <button class="app-button row__gap" @click="resetCountdown(10)">
            {{ $t('demo.resetCountdown') }}
          </button>
        </view>
      </view>

      <view class="card">
        <view class="card__header">
          <text class="card__title">{{ $t('demo.permission') }}</text>
          <text class="card__badge">admin</text>
        </view>
        <button v-if="isAdmin" class="app-button app-button--primary">
          {{ $t('demo.adminAction') }}
        </button>
        <text v-else class="result">{{ $t('demo.adminHidden') }}</text>
      </view>

      <view class="card">
        <view class="card__header">
          <text class="card__title">{{ $t('demo.cancel') }}</text>
          <text class="card__badge">cancelKey</text>
        </view>
        <text class="result">{{ cancelText }}</text>
        <view class="row">
          <button
            class="app-button"
            :disabled="cancelStatus === 'loading'"
            @click="startCancelableRequest"
          >
            {{ $t('demo.startCancelable') }}
          </button>
          <button class="app-button app-button--danger row__gap" @click="cancelPendingRequest">
            {{ $t('demo.cancelRequest') }}
          </button>
        </view>
      </view>

      <view class="card">
        <view class="card__header">
          <text class="card__title">{{ $t('demo.refresh') }}</text>
          <text class="card__badge">401 x 3</text>
        </view>
        <button class="app-button" :disabled="refreshing" @click="demoConcurrentRefresh">
          {{ $t('demo.expireAndRefresh') }}
        </button>
        <text v-if="refreshStatus" class="result">{{ refreshStatus }}</text>
        <text class="hint">{{ $t('demo.mockOnly') }}</text>
      </view>
    </view>
  </app-page>
</template>

<style lang="scss" scoped>
.demo {
  display: flex;
  flex-direction: column;
}

.card {
  margin-bottom: 24rpx;
  padding: 28rpx;
  background-color: var(--app-color-surface);
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-shadow-card);
}

.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.card__title {
  color: var(--app-color-text);
  font-size: 30rpx;
  font-weight: 600;
}

.card__badge {
  padding: 4rpx 16rpx;
  background-color: var(--app-color-bg);
  border-radius: 999rpx;
  color: var(--app-color-text-secondary);
  font-size: 22rpx;
}

.result {
  display: block;
  margin-top: 16rpx;
  color: var(--app-color-text-secondary);
  font-size: 24rpx;
}

.result__line {
  display: block;
  margin-top: 4rpx;
  color: var(--app-color-text-secondary);
  font-size: 24rpx;
}

.hint {
  display: block;
  margin-top: 12rpx;
  color: var(--app-color-text-placeholder);
  font-size: 22rpx;
}

.goods {
  margin-bottom: 16rpx;
}

.goods__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid var(--app-color-border);
}

.goods__item:last-child {
  border-bottom: none;
}

.goods__title {
  color: var(--app-color-text);
  font-size: 26rpx;
}

.goods__price {
  color: var(--app-color-primary);
  font-size: 26rpx;
  font-weight: 600;
}

.countdown__value {
  display: block;
  margin-bottom: 16rpx;
  color: var(--app-color-primary);
  font-size: 48rpx;
  font-weight: 700;
  text-align: center;
}

.row {
  display: flex;
  flex-direction: column;
}

.row__gap {
  margin-top: 16rpx;
}
</style>
