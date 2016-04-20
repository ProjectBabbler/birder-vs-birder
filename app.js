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
var UserUtils = require('./bin/react/utils/UserUtils');
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './bin/react/src/routes';
var React = require('react');
var CookieDough = require('cookie-dough');
var cookieParser = require('cookie-parser');
import ContextProvider from './bin/react/src/ContextProvider';


var app = express();
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(compression());
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'templates'));
app.use(require('prerender-node'));
app.use(cookieParser());


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
    var cookie = new CookieDough(req);
    var signedIn = cookie.get('signedIn') === 'true';
    // Note that req.url here should be the full URL path from
    // the original request, including the query string.
    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            // You can also check renderProps.components or renderProps.routes for
            // your "not found" component or route respectively, and send a 404 as
            // below, if you're using a catch-all route.
            res.render('index', {
                reactHtml: renderToString(React.createElement(
                    ContextProvider,
                    {
                        signedIn: signedIn,
                        radiumConfig: {userAgent: req.headers['user-agent']},
                    },
                    React.createElement(RouterContext, renderProps)
                )),
            });
        } else {
            res.status(404).send('Not found');
        }
    });
});

module.exports = app;
