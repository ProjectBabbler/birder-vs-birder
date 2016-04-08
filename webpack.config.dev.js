var path = require('path');
var webpack = require('webpack');
var mergeWebpackConfig = require('webpack-config-merger');

module.exports = mergeWebpackConfig(require('./webpack.config.js'), {
  output: {
    path: path.join(__dirname, 'dist'),
  },
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'BABEL_ENV': JSON.stringify('development/client')
      }
    })
  ]
});