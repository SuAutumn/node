const webpack = require('webpack')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')

module.exports = {
  context: path.resolve(__dirname),
  entry: './entry-client.js',
  devtool: '#cheap-module-source-map',
  output: {
    filename: '[name].[chunkhash:3].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'mainfest',
      minChunks: Infinity
    }),
    new VueSSRClientPlugin()
  ],
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