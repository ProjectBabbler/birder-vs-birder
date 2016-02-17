import React from 'react';
import { render } from 'react-dom';
require('babel-polyfill');
var App = require('./App');
var Base = require('./Base');
var SignIn = require('./SignIn');
var About = require('./About');
var { Router, Route, browserHistory } = require('react-router');

render(
    <Router history={browserHistory}>
        <Route component={Base}>
            <Route path="signin" component={SignIn} />
            <Route path="signup" component={SignIn} />
            <Route path="about" component={About} />
            <Route path="*" component={App} />
        </Route>
    </Router>
, document.getElementById('root'));