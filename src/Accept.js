var React = require('react');
import { browserHistory } from 'react-router';
var { Button } = require('react-bootstrap');
var SignupModal = require('./SignupModal');


var Accept = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
        userData: React.PropTypes.object,
    },

    acceptInvite() {

    },

    switchUser() {

    },

    componentDidMount() {
        var query = this.props.location.query;
        var challengeId = query.challengeId;
        var email = query.email;

        if (!challengeId) {
            browserHistory.push({
                pathname: '/',
            });
            return;
        } else if (this.context.userData && email == this.context.userData.email) {
            this.acceptInvite();
        }
    },

    renderAccept() {
        return (
            <div>
                <Button onClick={this.acceptInvite}>Accept Challenge</Button>
                <p>Signed in as {this.context.userData.email}. <a onClick={this.switchUser}>Switch users</a></p>
            </div>
        )
    },

    renderSigninup() {
        return (
            <div>
                <SignupModal show={true} />
            </div>
        );
    },

    render() {
        if (this.context.userData) {
            return this.renderAccept();
        } else {
            return this.renderSigninup();
        }
    },
});

module.exports = Accept;