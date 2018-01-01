const express = require('express')
const app = express()
const api = require('./routes/api')
const cors = require('cors')
const path = require('path')

function resolve(str) {
  return path.resolve(__dirname, str)
}

app.use(cors())
app.use('/static', express.static(resolve('./static')))

app.use('/api/v1/user/:id', api.user)
app.use('/api/v1/image', api.image)

app.listen(3000)