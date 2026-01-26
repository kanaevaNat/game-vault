import './shared/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/router.js';
import vuetify from './plugins/vuetify'
import { useAdminStore } from '@/entities/admin/store'

import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)

const adminStore = useAdminStore()
await adminStore.initialize()

app.mount('#app')
