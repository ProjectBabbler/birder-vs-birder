var React = require('react');
var SignIn = require('./SignIn');
var YourList = require('./YourList');
var SubscriptionList = require('./SubscriptionList');

var App = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
    },

    render() {
        if (this.context.authData) {
            return (
                <div>
                    <SubscriptionList />
                    <YourList />
                </div>
            );
        } else {
            return (
                <div>
                    I'm a fancy welcome page.
                </div>
            )
        }
    },
});

module.exports = App;