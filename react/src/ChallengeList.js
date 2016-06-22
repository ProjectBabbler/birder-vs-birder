var React = require('react');
var ReactFireMixin = require('reactfire');
var Challenge = require('./Challenge');
import CircularProgress from 'material-ui/CircularProgress';
var { PageHeader } = require('react-bootstrap');
var CreateChallenge = require('./CreateChallenge');

var firebase = require('../firebase');
var firebaseRef = firebase.database();



var ChallengeList = React.createClass({
    mixins: [ReactFireMixin],
    contextTypes: {
        authData: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            challenges: null,
        };
    },

    componentWillMount() {
        var challengesRef = firebaseRef.ref('users').child(this.context.authData.uid).child('challenges');
        this.bindAsArray(challengesRef, 'challenges');
    },

    renderChallenge(challenge) {
        return <Challenge key={challenge['.key']} id={challenge['.key']} />;
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
        } else if (this.state.challenges.length == 0) {
            return (
                <PageHeader style={{
                    width: '100%',
                    textAlign: 'center',
                }}>
                    You don't have any challenges yet.
                    Try <CreateChallenge style={{display: 'inline'}}><a>creating one</a></CreateChallenge>.
                </PageHeader>
            );
        } else {
            return (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                }}>
                    {this.state.challenges.map(this.renderChallenge)}
                </div>
            );
        }
    },
});

module.exports = ChallengeList;