import Vue from 'vue'
import App from './App.vue'
// import VueI18n from 'vue-i18n' // 国际化模块
import { locales } from './language.js'

import { createRouter } from "./router.js"

Vue.prototype.$t = function (str) {
  return locales['ch']['message'][str]
}
// Vue.use(I18n)
// Vue.locale('ch', locales['ch']['message'])

export function createApp() {
  const router = createRouter()
  const app = new Vue({
    render: h => h(App),
    router
  })
  return { app, router }
}