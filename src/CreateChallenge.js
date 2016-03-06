var React = require('react');
var { Button, Modal, DropdownButton, MenuItem, Input, ButtonGroup, Alert } = require('react-bootstrap');
var LocationsSearch = require('./LocationsSearch');
var emailValidator = require('email-validator');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var LoadingOverlay = require('./LoadingOverlay');
var axios = require('axios');


var CreateChallenge = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            showModal: false,
            location: null,
            timeFrame: 'life',
            friends: new Set(),
            email: '',
            loading: false,
            error: null,
        };
    },

    close() {
        this.setState(this.getInitialState());
    },

    open() {
        this.setState({
            showModal: true,
        });
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

    validateEmail() {
        var email = this.refs.emailInput.getValue();
        if (email.length && !emailValidator.validate(email)) {
            return 'error';
        }
        return;
    },


    emailChange() {
        this.setState({
            emailState: this.validateEmail(),
            email: this.refs.emailInput.getValue(),
        });
    },

    addFriend(e) {
        e.preventDefault();

        if (this.validateEmail() == 'error') {
            return;
        }
        var email = this.refs.emailInput.getValue();

        this.state.friends.add(email);
        this.setState({
            friends: this.state.friends,
            email: '',
        });
    },

    removeFriend(email) {
        this.state.friends.delete(email);
        this.setState({
            friends: this.state.friends,
        });
    },

    renderFriend(email) {
        return (
            <ButtonGroup key={email} bsSize="small" style={{
                marginRight: 5,
            }}>
                <Button>{email}</Button>
                <Button onClick={this.removeFriend.bind(this, email)}>X</Button>
            </ButtonGroup>
        )
    },

    renderFriends() {
        var content = [];
        this.state.friends.forEach((email) => {
            content.push(this.renderFriend(email));
        });
        return content;
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

        var name = this.refs.nameInput.getValue() || this.getDefaultName();
        var ref = firebaseRef.child('challenges').push();
        ref.set({
            name: name,
            code: this.state.location.value,
            time: this.state.timeFrame,
            owner: this.context.authData.uid,
            members: {
                [this.context.authData.uid]: false,
            },
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
            <div>
                <Button
                    bsStyle="primary"
                    onClick={this.open}>
                    Create Challenge
                </Button>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <LoadingOverlay isOpened={this.state.loading} />
                    <Modal.Header closeButton>
                        <Modal.Title>Create a new Challenge</Modal.Title>
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
                        />
                        <h4>Time Frame</h4>
                        <DropdownButton title={this.getTimeFrameTitle()} id="timeFrameDropdown">
                            <MenuItem eventKey="1" onClick={this.updateTimeFrame.bind(this, 'life')}>Life List</MenuItem>
                            <MenuItem eventKey="2" onClick={this.updateTimeFrame.bind(this, 'year')}>Year List</MenuItem>
                        </DropdownButton>
                        <h4>Friends</h4>
                        <p>Add some friends to compete in this challenge with. Don't worry you can add people once the challenge as been created too.</p>

                        <form onSubmit={this.addFriend}>
                            <Input
                                bsStyle={this.state.emailState}
                                value={this.state.email}
                                type="text"
                                onChange={this.emailChange}
                                placeholder="Add a friend by email"
                                ref="emailInput"
                                buttonAfter={
                                    <Button type="submit">Add</Button>
                                }
                            />
                        </form>
                        {this.renderFriends()}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Close</Button>
                        <Button type="submit" bsStyle="primary" onClick={this.onCreate}>Create</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    },
});

module.exports = CreateChallenge;