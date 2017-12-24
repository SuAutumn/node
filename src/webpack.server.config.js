const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const path = require('path')

module.exports = {
  context: path.resolve(__dirname),
  entry: './entry-server.js',
  target: 'node',
  devtool: 'source-map',
  output: {
    filename: 'server-bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    whitelist: /\.css$/
  }),
  plugins: [ new VueSSRServerPlugin() ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/
      }
    ]
  }
}