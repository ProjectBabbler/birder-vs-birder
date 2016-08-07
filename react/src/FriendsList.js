var React = require('react');
var { Button, FormControl, FormGroup, InputGroup } = require('react-bootstrap');
var emailValidator = require('email-validator');
var ButtonList = require('./ButtonList');

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
                <ButtonList list={this.props.friends} onChange={this.props.onFriendsChange} />
            </div>
        );
    },
});

module.exports = FriendsList;