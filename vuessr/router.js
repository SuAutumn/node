import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      // todo add route
      {paht: '/', component: () => import('./components/Home.vue')}
    ]
  })
}