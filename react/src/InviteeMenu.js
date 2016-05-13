var React = require('react');
var { DropdownButton, Glyphicon }= require('react-bootstrap');
var Confirm = require('react-confirm-bootstrap');
var MenuItem = require('./MenuItem');
var LoadingOverlay = require('./LoadingOverlay');
var axios = require('axios');


var InviteeMenu = React.createClass({
    getInitialState() {
        return {
            loading: false,
        };
    },

    onResend() {
        this.setState({
            loading: true,
        });
        this.props.challengeRef.child('invites').child(this.props['.key']).child('sent').set(true)
            .then(() => {
                return axios.post('/api/emailInvites', {
                    challengeId: this.props.challengeRef.key(),
                });
            })
            .catch(() => {})
            .then(() => {
                this.setState({
                    loading: false,
                });
            });
    },

    onRemove() {
        this.setState({
            loading: true,
        });
        this.props.challengeRef.child('invites').child(this.props['.key']).set(null)
            .catch(() => {})
            .then(() => {
                this.setState({
                    loading: false,
                });
            });
    },

    render() {
        return (
            <div>
                <LoadingOverlay isOpened={this.state.loading} />
                <DropdownButton
                    title={<Glyphicon glyph="cog" />}
                    id={this.props['.key']}
                    bsSize="xsmall">
                    <Confirm
                        key="confirm"
                        onConfirm={this.onRemove}
                        body="Are you sure you want to remove this invitation? You can always invite them back later."
                        confirmText="Confirm"
                        title={`Remove "${this.props.email}"`}>
                        <MenuItem>Remove</MenuItem>
                    </Confirm>
                    <MenuItem key="resend" onClick={this.onResend}>Resend</MenuItem>
                </DropdownButton>
            </div>
        );
    },
});

module.exports = InviteeMenu;