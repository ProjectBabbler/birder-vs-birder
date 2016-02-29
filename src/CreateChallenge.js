var React = require('react');
var { Button, Modal, DropdownButton, MenuItem, Input, ButtonGroup } = require('react-bootstrap');
var LocationsSearch = require('./LocationsSearch');
var emailValidator = require('email-validator');


var CreateChallenge = React.createClass({
    getInitialState() {
        return {
            showModal: false,
            location: null,
            timeFrame: 'life',
            friends: new Set(),
            email: '',
        };
    },

    close() {
        this.setState({
            showModal: false,
         });
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

    render() {
        return (
            <div>
                <Button
                    bsStyle="primary"
                    onClick={this.open}>
                    Create Challenge
                </Button>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a new Challenge</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Location for your Challenge</h4>
                        <LocationsSearch value={this.state.location} onChange={this.updateLocation} />
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
                        <Button type="submit" bsStyle="primary">Create</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    },
});

module.exports = CreateChallenge;