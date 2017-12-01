const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('index.tmp.html', 'utf-8')
})

server.get('*', (req, res) => {
  const app = new Vue({
    context: {
      title: 'Vue Server Renderer',
      meta: '<meta name="format-detection" content="telephone=no" />'
    },
    data: {
      url: req.url
    },
    template: '<div>visit url: {{ url }}</div>'
  })
  renderer.renderToString(app, app.$options.context, (err, html) => {
    // index.tmp.html 模板
    if (err) {
      console.log(err)
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

server.listen(3000)