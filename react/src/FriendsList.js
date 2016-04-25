var React = require('react');
var { Button, FormControl, FormGroup, ButtonGroup, InputGroup } = require('react-bootstrap');
var emailValidator = require('email-validator');

var FriendsList = React.createClass({
    getInitialState() {
        return {
            email: '',
        };
    },

    validateEmail(email) {
        if (email.length && !emailValidator.validate(email)) {
            return 'error';
        }
        return;
    },

    emailChange(e) {
        this.setState({
            emailState: this.validateEmail(e.target.value),
            email: e.target.value,
        });
    },

    addFriend(e) {
        e.preventDefault();

        var email = this.state.email;

        if (!email || this.validateEmail(email) == 'error') {
            return;
        }

        var set = new Set(this.props.friends);
        set.add(email);
        this.setState({
            email: '',
        });
        this.props.onFriendsChange(set);
    },

    removeFriend(email) {
        var set = new Set(this.props.friends);
        set.delete(email);
        this.props.onFriendsChange(set);
    },

    renderFriend(email) {
        return (
            <ButtonGroup key={email} bsSize="small" style={{
                marginRight: 5,
            }}>
                <Button>{email}</Button>
                <Button onClick={this.removeFriend.bind(this, email)}>X</Button>
            </ButtonGroup>
        );
    },

    renderFriends() {
        var content = [];
        this.props.friends.forEach((email) => {
            content.push(this.renderFriend(email));
        });
        return content;
    },

    render() {
        return (
            <div>
                <h4>Friends</h4>
                <p>{this.props.message}</p>
                <form onSubmit={this.addFriend}>
                    <FormGroup validationState={this.state.emailState}>
                        <InputGroup>
                            <FormControl
                                value={this.state.email}
                                type="text"
                                onChange={this.emailChange}
                                placeholder="Add a friend by email"
                            />
                            <InputGroup.Button>
                                <Button onClick={this.addFriend} type="submit">Add</Button>
                            </InputGroup.Button>
                        </InputGroup>
                    </FormGroup>
                </form>
                {this.renderFriends()}
            </div>
        );
    },
});

module.exports = FriendsList;