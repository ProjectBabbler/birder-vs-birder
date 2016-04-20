import React from 'react';
var App = require('./App');
var Base = require('./Base');
var SignInPage = require('./SignInPage');
var SignupPage = require('./SignupPage');
var Accept = require('./Accept');
var { Router, Route, browserHistory, IndexRoute } = require('react-router');
var MainContent = require('./MainContent');
var ChallengePage = require('./ChallengePage');
var DonatePage = require('./DonatePage');
var ThankYouPage = require('./ThankYouPage');
var SettingsPage = require('./SettingsPage');
var PrivateUserPages = require('./PrivateUserPages');
var UserPage = require('./UserPage');
var WelcomePage = require('./WelcomePage');

module.exports = (
    <Router history={browserHistory}>
        <Route path="/" component={Base}>
            <Route path="home" component={WelcomePage} />
            <Route component={MainContent}>
                <Route path="signin" component={SignInPage} />
                <Route path="signup" component={SignupPage} />
                <Route path="accept" component={Accept} />
                <Route path="donate" component={DonatePage} />
                <Route path="thankyou" component={ThankYouPage} />
                <Route path="challenge" component={ChallengePage} />
                <Route path="user/:username">
                    <Route component={PrivateUserPages}>
                        <Route path="settings" component={SettingsPage} />
                    </Route>
                    <IndexRoute component={UserPage} />
                </Route>
            </Route>
            <IndexRoute component={App} />
            <Route path="*" component={App} />
        </Route>
    </Router>
);