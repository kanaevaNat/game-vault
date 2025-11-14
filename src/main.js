import './shared/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/router.js';

import vuetify from './plugins/vuetify'

import App from './App.vue'

const pinia = createPinia()

createApp(App).use(pinia).use(router).use(vuetify).mount('#app')
