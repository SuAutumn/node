const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./index.tmp.html', 'utf-8')
})

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: '<div>visit url: {{ url }}</div>'
  })

  const context = {
    title: 'Vue Server Renderer',
    meta: '<meta name="format-detection" content="telephone=no" />'
  }
  renderer.renderToString(app, context, (err, html) => {
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