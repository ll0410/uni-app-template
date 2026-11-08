import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import { uniStorage } from './plugins/persist'

export const pinia = createPinia()

pinia.use(
  createPersistedState({
    storage: uniStorage,
  }),
)

export default pinia
