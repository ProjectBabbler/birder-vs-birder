var React = require('react');
var { Button, Modal, Alert } = require('react-bootstrap');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var LoadingOverlay = require('./LoadingOverlay');
var axios = require('axios');
var FriendsList = require('./FriendsList');


var AddFriendsModal = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            friends: new Set(),
            loading: false,
            error: null,
        };
    },

    close() {
        this.props.onClose();
    },

    onFriendsChange(friends) {
        this.setState({
            friends,
        });
    },

    onAdd() {
        this.setState({
            loading: true,
        });

        var ref = firebaseRef.child('challenges').child(this.props.challengeId);
        var ps = [];
        this.state.friends.forEach(email => {
            var r = ref.child('invites').push();
            ps.push(r.set({
                email: email,
                inviter: this.context.authData.uid,
                sent: false,
            }));
        });
        Promise.all(ps).then(() => {
            return axios.post('/api/emailInvites', {
                challengeId: ref.key(),
            });
        }).then(() => {
            this.close();
        }).catch((e) => {
            this.setState({
                error: e.data,
            });
        }).then(() => {
            this.setState({
                loading: false,
            });
        });
    },

    render() {
        return (
            <Modal show={true} onHide={this.close}>
                <LoadingOverlay isOpened={this.state.loading} />
                <Modal.Body>
                    {this.state.error ? (
                        <Alert bsStyle="danger">
                            {this.state.error.message || 'Sorry, something went wrong'}
                        </Alert>
                    ) : null}
                    <FriendsList
                        friends={this.state.friends}
                        onFriendsChange={this.onFriendsChange}
                        message="Add some friends to compete in this challenge with"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                    <Button type="submit" bsStyle="primary" onClick={this.onAdd}>Submit</Button>
                </Modal.Footer>
            </Modal>
        );
    },
});

module.exports = AddFriendsModal;