var path = require('path');
var express = require('express');
var signin = require('./routes/signin');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
if (app.get('env') === 'development') {
    var webpack = require('webpack');
    var config = require('./webpack.config.dev');
    var compiler = webpack(config);
    app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler));
}

app.use('/signin', signin);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
