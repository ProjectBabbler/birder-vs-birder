var path = require('path');
var webpack = require('webpack');

module.exports = {
  output: {
    path: path.join(__dirname, 'public/static/'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    loaders: [{
      test: /\.jsx?/,
      loaders: ['babel'],
      include: [path.join(__dirname, 'react')]
    }, {
      test: /\.css$/, // Only .css files
      loader: 'style!css' // Run both loaders
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'BROWSER': true,
      }
    })
  ]
};
