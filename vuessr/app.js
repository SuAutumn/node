// const Vue = require('vue')
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'

export function createApp () {
  const router = createRouter()
  const app = new Vue({
    render: createElement => createElement(App),
    router
  })
  return { app, router }
}

/**
 * factory fun to create a Vue instance
 * @param {Object} context Vue options info
 */
// module.exports = function (context) {
//   return new Vue({
//     context: context.content,
//     data: {
//       url: context.url
//     },
//     template: '<div>visit url: {{ url }}</div>'
//   })
// }