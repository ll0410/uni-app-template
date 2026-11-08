<script setup lang="ts">
const userStore = useUserStore()
const { hasRole } = usePermission()

const isAdmin = computed(() => hasRole('admin'))
const initial = computed(() => (userStore.userInfo?.nickname ?? 'U').slice(0, 1))

function goGoods() {
  uni.navigateTo({
    url: '/subPackages/goods/pages/list/index',
  })
}

function goOrders() {
  uni.navigateTo({
    url: '/subPackages/order/pages/list/index',
  })
}

function goDemo() {
  uni.navigateTo({
    url: '/subPackages/demo/pages/index/index',
  })
}

async function handleLogout() {
  await userStore.logout()
  uni.reLaunch({ url: '/pages/index/index' })
}
</script>

<template>
  <app-page>
    <view class="mine">
      <view class="mine__profile">
        <view class="avatar">{{ initial }}</view>
        <view class="info">
          <text class="nickname">{{ userStore.userInfo?.nickname ?? '-' }}</text>
          <text class="username">@{{ userStore.userInfo?.username ?? '-' }}</text>
          <view class="tags">
            <text v-for="role in userStore.roles" :key="role" class="tag">{{ role }}</text>
          </view>
        </view>
      </view>

      <view class="card">
        <text class="card__title">{{ $t('mine.permissions') }}</text>
        <view class="permissions">
          <text v-for="permission in userStore.permissions" :key="permission" class="permission">
            {{ permission }}
          </text>
        </view>
      </view>

      <view class="card">
        <text class="card__title">{{ $t('mine.adminOnly') }}</text>
        <button v-if="isAdmin" class="app-button app-button--primary" @click="goDemo">
          {{ $t('demo.adminAction') }}
        </button>
        <text v-else class="card__text">{{ $t('mine.adminTip') }}</text>
      </view>

      <view class="actions">
        <button class="app-button" @click="goGoods">{{ $t('mine.goods') }}</button>
        <button class="app-button actions__gap" @click="goOrders">{{ $t('mine.orders') }}</button>
        <button class="app-button actions__gap" @click="goDemo">{{ $t('mine.goDemo') }}</button>
        <button class="app-button app-button--danger actions__gap" @click="handleLogout">
          {{ $t('mine.logout') }}
        </button>
      </view>
    </view>
  </app-page>
</template>

<style lang="scss" scoped>
.mine__profile {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  padding: 32rpx;
  background-color: var(--app-color-surface);
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-shadow-card);
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  background-color: var(--app-color-primary);
  border-radius: 50%;
  color: #fff;
  font-size: 40rpx;
  font-weight: 700;
}

.info {
  flex: 1;
  margin-left: 24rpx;
}

.nickname {
  display: block;
  color: var(--app-color-text);
  font-size: 34rpx;
  font-weight: 700;
}

.username {
  display: block;
  margin-top: 4rpx;
  color: var(--app-color-text-secondary);
  font-size: 24rpx;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 12rpx;
}

.tag {
  margin-right: 12rpx;
  margin-bottom: 8rpx;
  padding: 4rpx 16rpx;
  background-color: rgb(43 108 255 / 10%);
  border-radius: 999rpx;
  color: var(--app-color-primary);
  font-size: 22rpx;
}

.card {
  margin-bottom: 24rpx;
  padding: 24rpx 28rpx;
  background-color: var(--app-color-surface);
  border-radius: var(--app-radius-md);
}

.card__title {
  display: block;
  margin-bottom: 12rpx;
  color: var(--app-color-text);
  font-size: 28rpx;
  font-weight: 600;
}

.card__text {
  display: block;
  color: var(--app-color-text-secondary);
  font-size: 24rpx;
}

.permissions {
  display: flex;
  flex-wrap: wrap;
}

.permission {
  margin-right: 12rpx;
  margin-bottom: 8rpx;
  padding: 4rpx 12rpx;
  background-color: var(--app-color-bg);
  border-radius: 6rpx;
  color: var(--app-color-text-secondary);
  font-size: 22rpx;
}

.actions {
  margin-top: 8rpx;
}

.actions__gap {
  margin-top: 16rpx;
}
</style>
