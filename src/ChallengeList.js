var React = require('react');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');
var Challenge = require('./Challenge');
var CircularProgress = require('material-ui/lib/circular-progress');


var ChallengeList = React.createClass({
    mixins: [ReactFireMixin],
    contextTypes: {
        authData: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            challenges: [],
        };
    },

    componentWillMount() {
        var challengesRef = firebaseRef.child('users').child(this.context.authData.uid).child('challenges');
        this.bindAsArray(challengesRef, 'challenges');
    },

    renderChallenge(challenge) {
        return <Challenge key={challenge['.key']} id={challenge['.key']} />
    },

    render() {
        if (this.state.challenges == null) {
            return (
                <div style={{
                    marginTop: 100,
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <CircularProgress size={2} />
                </div>
            );
        }

        return (
            <div style={{
                display: 'flex',
            }}>
                {this.state.challenges.map(this.renderChallenge)}
            </div>
        );
    },
});

module.exports = ChallengeList;