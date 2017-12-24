// const createApp = require('./entry-server.js')
const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false
})
// const renderer = require('vue-server-renderer').createRenderer()
const server = require('express')()
// console.log(createApp)

server.get('*', (req, res) => {
  const context = { url: req.url }
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