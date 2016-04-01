var React = require('react');
var { Button, Modal, DropdownButton, MenuItem, Input, Alert } = require('react-bootstrap');
var LocationsSearch = require('bird-locations/lib/search');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var LoadingOverlay = require('./LoadingOverlay');
var axios = require('axios');
var FriendsList = require('./FriendsList');


var CreateChallengeModal = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            location: this.props.location || null,
            timeFrame: this.props.timeFrame || 'life',
            friends: new Set(),
            name: this.props.name || '',
            loading: false,
            error: null,
        };
    },

    close() {
        this.props.onClose();
    },

    updateLocation(value) {
        this.setState({
            location: value,
        });
    },

    getTimeFrameTitle() {
        if (this.state.timeFrame == 'life') {
            return 'Life List';
        } else if (this.state.timeFrame == 'year') {
            return 'Year List';
        }
    },

    updateTimeFrame(timeFrame) {
        this.setState({
            timeFrame,
        });
    },

    nameChange() {
        this.setState({
            name: this.refs.nameInput.getValue(),
        });
    },

    onFriendsChange(friends) {
        this.setState({
            friends,
        });
    },

    onCreate() {
        if (!this.state.location) {
            this.setState({
                error: 'Please pick a location',
            });

            return;
        }

        this.setState({
            loading: true,
        });

        var name = this.state.name || this.getDefaultName();

        var ref;
        var members;
        if (this.props.edit) {
            ref = firebaseRef.child('challenges').child(this.props.challengeId);
            members = this.props.members;
        } else {
            ref = firebaseRef.child('challenges').push();
            members = {
                [this.context.authData.uid]: false,
            };
        }

        ref.set({
            name: name,
            code: this.state.location.value,
            time: this.state.timeFrame,
            owner: this.context.authData.uid,
            members: members,
        }).then(() => {
            var ps = [];
            this.state.friends.forEach(email => {
                var r = ref.child('invites').push();
                ps.push(r.set({
                    email: email,
                    sent: false,
                }));
            });
            return Promise.all(ps);
        }).then(() => {
            return firebaseRef.child('users').child(this.context.authData.uid).child('challenges').child(ref.key()).set(true);
        }).then(() => {
            return axios.post('/api/emailInvites', {
                challengeId: ref.key(),
            });
        }).catch((e) => {
            this.setState({
                error: e,
            });
        }).then(() => {
            this.close();
        }).then(() => {
            this.setState({
                loading: false,
            });
        });
    },

    getDefaultName() {
        return `${this.getTimeFrameTitle()} for ${this.state.location.label}`;
    },

    getNamePlaceholder() {
        if (!this.state.location) {
            return 'Please pick a location';
        } else {
            return `Default name "${this.getDefaultName()}"`;
        }
    },

    render() {
        return (
            <Modal show={true} onHide={this.close}>
                <LoadingOverlay isOpened={this.state.loading} />
                <Modal.Header closeButton={true}>
                    <Modal.Title>{this.props.edit ? 'Edit Challenge' : 'Create a new Challenge'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.error ? (
                        <Alert bsStyle="danger">
                            {this.state.error || 'Sorry, something went wrong'}
                        </Alert>
                    ) : null}
                    <h4>Location for your Challenge</h4>
                    <LocationsSearch value={this.state.location} onChange={this.updateLocation} />
                    <h4>Name</h4>
                    <Input
                        type="text"
                        placeholder={this.getNamePlaceholder()}
                        ref="nameInput"
                        onChange={this.nameChange}
                        value={this.state.name}
                    />
                    <h4>Time Frame</h4>
                    <DropdownButton title={this.getTimeFrameTitle()} id="timeFrameDropdown">
                        <MenuItem eventKey="1" onClick={this.updateTimeFrame.bind(this, 'life')}>Life List</MenuItem>
                        <MenuItem eventKey="2" onClick={this.updateTimeFrame.bind(this, 'year')}>Year List</MenuItem>
                    </DropdownButton>
                    <FriendsList
                        friends={this.state.friends}
                        onFriendsChange={this.onFriendsChange}
                        message="Add some friends to compete in this challenge with. Don't worry you can add people once the challenge as been created too."
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                    <Button type="submit" bsStyle="primary" onClick={this.onCreate}>{this.props.edit ? 'Save' : 'Create'}</Button>
                </Modal.Footer>
            </Modal>
        );
    },
});

module.exports = CreateChallengeModal;