import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 导航守卫
import '@/router/navigation-guard.ts';
// 公共样式
import './assets/styles/index.scss'
// i18n
import i18n from "./locale";
// svg
import 'virtual:svg-icons-register';
// element-plus
import '@/assets/styles/element/index.scss'
// 自定义指令
import * as directives from "@/directive"
// pinia 插件
import { resetState } from "@/util/pinia-plugins"

const app = createApp(App)
const pinia = createPinia()

pinia.use(resetState)

app.use(router)
app.use(pinia)
app.use(i18n)

Object.keys(directives).forEach((key) => {
    app.directive(key, (directives as any)[key]())
})

app.mount('#app')
