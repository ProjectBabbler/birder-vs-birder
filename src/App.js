var React = require('react');
var SignIn = require('./SignIn');
var YourList = require('./YourList');
var SubscriptionList = require('./SubscriptionList');
var Friends = require('./Friends');
var CreateChallenge = require('./CreateChallenge');
var ChallengeList = require('./ChallengeList');

var App = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
    },

    render() {
        if (this.context.authData) {
            return (
                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}>
                        <CreateChallenge />
                    </div>
                    <div style={{
                        display: 'flex',
                    }}>
                        <ChallengeList />
                    </div>
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