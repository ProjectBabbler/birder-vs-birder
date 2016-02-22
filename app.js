var path = require('path');
var express = require('express');
var ebirdLogin = require('./routes/ebirdLogin');
var ebirdScrape = require('./routes/ebirdScrape');
var ebirdListScrape = require('./routes/ebirdListScrape');


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

app.use('/api/ebirdLogin', ebirdLogin);
app.use('/api/ebirdScrape', ebirdScrape);
app.use('/api/ebirdListScrape', ebirdListScrape);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
