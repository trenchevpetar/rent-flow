import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import pinia from './store/global.ts';
import { router } from './router';
import './router/middleware.ts'

createApp(App).use(pinia).use(router).mount('#app')
