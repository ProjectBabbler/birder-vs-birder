import React from 'react';
import { render } from 'react-dom';
require('babel-polyfill');
require('../styles/CustomStyles.css');
var App = require('./App');
var Base = require('./Base');
var SignInPage = require('./SignInPage');
var SignupPage = require('./SignupPage');
var Accept = require('./Accept');
var { Router, Route, browserHistory } = require('react-router');
var MainContent = require('./MainContent');
var ChallengePage = require('./ChallengePage');
var DonatePage = require('./DonatePage');
var ThankYouPage = require('./ThankYouPage');
var SettingsPage = require('./SettingsPage');
var UserPages = require('./UserPages');

render(
    <Router history={browserHistory}>
        <Route component={Base}>
            <Route component={MainContent}>
                <Route path="signin" component={SignInPage} />
                <Route path="signup" component={SignupPage} />
                <Route path="accept" component={Accept} />
                <Route path="donate" component={DonatePage} />
                <Route path="thankyou" component={ThankYouPage} />
                <Route path="challenge" component={ChallengePage} />
                <Route path="user/:userId" component={UserPages}>
                    <Route path="settings" component={SettingsPage} />
                </Route>
            </Route>
            <Route path="*" component={App} />
        </Route>
    </Router>
, document.getElementById('root'));