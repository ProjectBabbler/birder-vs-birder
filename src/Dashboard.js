var React = require('react');
var YourList = require('./YourList');
var CreateChallenge = require('./CreateChallenge');
var ChallengeList = require('./ChallengeList');

var Dashboard = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
    },

    render() {
        if (!this.context.authData) {
            return <div/>;
        }
        return (
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: 20,
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
    },
});

module.exports = Dashboard;