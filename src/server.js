// const createApp = require('./entry-server.js')
const path = require('path')


function resolve(filename) {
  return path.resolve(__dirname, filename)
}

const isProd = process.env.NODE_ENV === 'production'
// const renderer = require('vue-server-renderer').createRenderer()
const express = require('express')
const server = express()
// console.log(createApp)

const { createBundleRenderer } = require('vue-server-renderer')
let renderer
let readyPromise
if (isProd) {
  const serverBundle = require(resolve('./dist/vue-ssr-server-bundle.json'))
  const clientManifest = require(resolve('./dist/vue-ssr-client-manifest.json'))
  const template = require('fs').readFileSync(resolve('./index.template.html'), 'utf-8')
  renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    // basedir: resolve('./dist'),
    template,
    clientManifest
  })
} else {
  readyPromise = require('./setup-dev-server')(server, resolve('./index.template.html'), (bundle, options) => {
    renderer = createBundleRenderer(bundle, options)
  })
}

server.use('/dist', express.static(resolve('./dist'))) // webpack打包文件
server.use('/static', express.static(resolve('./static'))) // 样式文件

let render = (req, res) => {
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
}

server.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res))
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
// })

server.listen(8080)