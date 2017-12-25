// const createApp = require('./entry-server.js')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const template = require('fs').readFileSync(path.resolve(__dirname, './index.template.html'), 'utf-8')
const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template,
  clientManifest
})
// const renderer = require('vue-server-renderer').createRenderer()
const server = require('express')()
// console.log(createApp)

server.get('*', (req, res) => {
  const context = {
    url: req.url,
    title: '运营平台'
  }
  renderer.renderToString(context, (err, html) => {
    if (err) {
      if (err.code === 404) {
        res.status(404).end('Page not found')
      } else {
        res.status(500).end('Internal Server Error')
      }
    } else {
      res.end(html)
    }
  })
  // createApp(context)
  //   .then(app => {
  //     renderer.renderToString(app, (err, html) => {
  //       if (err) {
  //         if (err.code === 404) {
  //           res.status(404).end('Page not found')
  //         } else {
  //           res.status(500).end('Internal Server Error')
  //         }
  //       } else {
  //         res.end(html)
  //       }
  //     })
  //   })
})

server.listen(8080)