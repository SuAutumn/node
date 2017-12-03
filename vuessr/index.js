const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('index.tmp.html', 'utf-8')
})
const createApp = require('./app')
console.log(createApp)

server.get('*', (req, res) => {
  const context = {
    url: req.url,
    content: {
      title: 'Vue Server Renderer',
      meta: '<meta name="format-detection" content="telephone=no" />'
    }
  }
  const app = createApp(context)
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