import './shared/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/router.js';
import vuetify from './plugins/vuetify'
import 'vuetify/styles'
import { useAdminStore } from '@/entities/admin/store'
import {i18n} from '@/plugins/vuelidate.js'

import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(i18n)

const adminStore = useAdminStore()
await adminStore.initialize()

app.mount('#app')
