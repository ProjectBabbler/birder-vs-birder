var React = require('react');
import { browserHistory } from 'react-router';
var SignupModal = require('./SignupModal');
var SignInModal = require('./SignInModal');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var LoadingOverlay = require('./LoadingOverlay');


var Accept = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
        userData: React.PropTypes.object,
    },

    getInitialState() {
        return {
            challenge: null,
            user: null,
            loading: true,
        };
    },

    acceptInvite() {

    },

    abort() {
        browserHistory.push({
            pathname: '/',
        });
    },

    componentDidMount() {
        var query = this.props.location.query;
        var challengeId = query.challengeId;
        var email = query.email;

        if (!challengeId || !email) {
            this.abort();
            return;
        }

        if (this.context.userData && email == this.context.userData.email) {
            this.acceptInvite();
        }

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
        return <SignInModal show={true} />;
    },

    renderSignup() {
        return <SignupModal show={true} />;
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

module.exports = Accept;