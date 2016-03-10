var React = require('react');
import { browserHistory } from 'react-router';
var SignupModal = require('./SignupModal');
var SignInModal = require('./SignInModal');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var LoadingOverlay = require('./LoadingOverlay');


var Accept = React.createClass({
    getInitialState() {
        return {
            challenge: null,
            user: null,
            loading: true,
        };
    },

    acceptInvite() {
        var query = this.props.location.query;
        var challengeId = query.challengeId;
        var email = query.email;

        var challengeRef = firebaseRef.child('challenges').child(challengeId);

        var ps = [];
        this.setState({
            loading: true,
        });

        ps.push(challengeRef.child('members').child(this.props.authData.uid).set(true));
        ps.push(firebaseRef.child('users').child(this.props.authData.uid).child('challenges').child(challengeId).set(true));

        ps.push(challengeRef.child('invites').orderByChild('email').equalTo(email).once('value').then((snap) => {
            var ps = [];
            snap.forEach(subSnap => {
                ps.push(challengeRef.child('invites').child(subSnap.key()).set(null));
            });
            return Promise.all(ps);
        }));

        Promise.all(ps).then(() => {
            console.log('Accepted - redirecting');
            browserHistory.push({
                pathname: '/',
            });
        }).catch((e) => {
            console.log(e);
            this.setState({
                loading: false,
            });
        });
    },

    abort() {
        browserHistory.push({
            pathname: '/',
        });
    },

    componentWillReceiveProps(props) {
        this.checkMatch(props);
    },

    checkMatch(props=this.props) {
        var query = props.location.query;
        var challengeId = query.challengeId;
        var email = query.email;

        if (!challengeId || !email) {
            this.abort();
            return;
        }

        if (props.userData && email == props.userData.email) {
            this.acceptInvite();
        }
    },

    componentDidMount() {
        var query = this.props.location.query;
        var challengeId = query.challengeId;
        var email = query.email;
        this.checkMatch();

        var ps = [];
        ps.push(firebaseRef.child('users').orderByChild('email').equalTo(email).once('value'));
        ps.push(firebaseRef.child('challenges').child(challengeId).once('value'));
        Promise.all(ps).then(results => {
            this.setState({
                user: results[0].val(),
                challenge: results[1].val(),
                loading: false,
            });
        });
    },

    renderError() {
        return (
            <h3>No Challenge by that id</h3>
        );
    },

    renderLogin() {
        return <SignInModal show={true} onSignin={this.acceptInvite} />;
    },

    renderSignup() {
        return <SignupModal show={true} onSignup={this.acceptInvite} />;
    },

    render() {
        if (this.state.loading) {
            return <LoadingOverlay isOpened={this.state.loading} />;
        }
        if (!this.state.challenge) {
            return this.renderError();
        }

        var userExists = this.state.userData && this.state.userData.email;

        if (userExists) {
            return this.renderLogin();
        } else {
            return this.renderSignup();
        }
    },
});

var Wrapper = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
        userData: React.PropTypes.object,
    },

    render() {
        return <Accept {...this.props} authData={this.context.authData} userData={this.context.userData} />;
    },
});

module.exports = Wrapper;