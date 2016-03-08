var React = require('react');
var SignIn = require('./SignIn');
var { browserHistory } = require('react-router');


var SignInPage = React.createClass({
    onSignIn() {
        browserHistory.push({
            pathname: '/',
        });
    },

    render() {
        return (
            <SignIn onSignIn={this.onSignIn} />
        );
    },
});

module.exports = SignInPage;