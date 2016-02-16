import React from 'react';
import { render } from 'react-dom';
require('babel-polyfill');
var App = require('./App');
var Base = require('./Base');
var { Router, Route, browserHistory } = require('react-router');

render(
    <Router history={browserHistory}>
        <Route component={Base}>
            <Route path="*" component={App} />
        </Route>
    </Router>
, document.getElementById('root'));