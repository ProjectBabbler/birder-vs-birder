var React = require('react');
import { browserHistory } from 'react-router';
var { Button } = require('react-bootstrap');
var SignupModal = require('./SignupModal');
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
            showSignup: false,
            loading: true,
        };
    },

    acceptInvite() {

    },

    switchUser() {
        this.setState({
            showSignup: true,
        });
    },

    onSignupClose() {
        this.setState({
            showSignup: false,
        });
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

    renderAccept() {
        return (
            <div>
                <Button onClick={this.acceptInvite}>Accept Challenge</Button>
                <p>Signed in as {this.context.userData.email}. <a onClick={this.switchUser}>Switch users</a></p>
            </div>
        )
    },

    renderError() {
        return (
            <h3>No Challenge by that id</h3>
        );
    },

    renderPermissionsError() {
        return (
            <div>
                <p>Signed in as {this.context.userData.email}.</p>
                <p>You don't have permission to accept this challenge. <a onClick={this.switchUser}>Switch users</a></p>
            </div>
        );
    },

    render() {
        if (this.state.loading) {
            return <LoadingOverlay isOpened={this.state.loading} />;
        }
        if (!this.state.challenge) {
            return this.renderError();
        }

        if (this.context.userData && this.state.userData &&
            this.context.userData.email != this.state.userData.email) {
            return this.renderPermissionsError();
        }

        return (
            <div>
                {this.context.userData ? this.renderAccept() : null}
                <SignupModal show={this.state.showSignup} close={this.onSignupClose} />
            </div>
        )
    },
});

module.exports = Accept;