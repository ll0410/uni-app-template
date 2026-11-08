<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'

import { useTheme } from '@/hooks/useTheme'
import { useUserStore } from '@/stores/modules/user'

onLaunch(() => {
  const { applyTheme } = useTheme()
  applyTheme()

  const userStore = useUserStore()
  if (userStore.isLoggedIn && !userStore.userInfo) {
    void userStore.fetchProfile().catch(() => {})
  }
})
</script>

<style lang="scss">
@import './styles/index';
</style>
