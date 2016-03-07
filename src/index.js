import React from 'react';
import { render } from 'react-dom';
require('babel-polyfill');
var App = require('./App');
var Base = require('./Base');
var SignIn = require('./SignIn');
var SignupPage = require('./SignupPage');
var About = require('./About');
var Accept = require('./Accept');
var { Router, Route, browserHistory } = require('react-router');

render(
    <Router history={browserHistory}>
        <Route component={Base}>
            <Route path="signin" component={SignIn} />
            <Route path="signup" component={SignupPage} />
            <Route path="about" component={About} />
            <Route path="accept" component={Accept} />
            <Route path="*" component={App} />
        </Route>
    </Router>
, document.getElementById('root'));