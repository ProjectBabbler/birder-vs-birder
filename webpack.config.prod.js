var webpack = require('webpack');
var mergeWebpackConfig = require('webpack-config-merger');


module.exports = mergeWebpackConfig(require('./webpack.config.js'), {
  entry: [
    './src/index'
  ],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ]
});