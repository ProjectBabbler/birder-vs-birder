var React = require('react');
var Signup = require('./Signup');
var { browserHistory } = require('react-router');


var SignupPage = React.createClass({
    onSignup() {
        browserHistory.push({
            pathname: '/',
        });
    },

    render() {
        return (
            <Signup onSignup={this.onSignup} />
        );
    },
});

module.exports = SignupPage;