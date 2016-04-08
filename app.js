var path = require('path');
var express = require('express');
var ebirdLogin = require('./routes/ebirdLogin');
var ebirdScrape = require('./routes/ebirdScrape');
var ebirdListScrape = require('./routes/ebirdListScrape');
var invite = require('./routes/invite');
var challengeLists = require('./routes/challengeLists');
var userLists = require('./routes/userLists');
var donate = require('./routes/donate');
var compression = require('compression');
var favicon = require('serve-favicon');
var swig = require('swig');
var UserUtils = require('./utils/UserUtils');
var Keys = require('./src/Keys');



var app = express();
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(compression());
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'templates'));
app.use(require('prerender-node').set('prerenderToken', Keys.prerenderToken));


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
app.use('/api/emailInvites', invite);
app.use('/api/challengeLists', challengeLists);
app.use('/api/userLists', userLists);
app.use('/api/donate', donate);

app.get('/user/:username', (req, res) => {
    var username = req.params.username;
    UserUtils.getUserByName(username).then(userData => {
        UserUtils.getFBShareImage(userData._key).then(imageData => {
            if (imageData) {
                res.render('user', {
                    userBadgeUrl: `${imageData.url}?version=${imageData.version}`,
                    userName: userData.fullname,
                    userUrl: `http://www.birdervsbirder.com/user/${username}`
                });
            } else {
                res.render('user');
            }
        });
    });
});

app.get('*', (req, res) => {
    res.render('index');
});

module.exports = app;
