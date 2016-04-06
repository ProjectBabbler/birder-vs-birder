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
      include: [path.join(__dirname, 'src'), path.join(__dirname, 'utils'), path.join(__dirname, 'shared')]
    }, {
      test: /\.css$/, // Only .css files
      loader: 'style!css' // Run both loaders
    }]
  }
};
