var React = require('react');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');
var { ListGroup, ListGroupItem, Panel, Input, Button } = require('react-bootstrap');
var emailValidator = require('email-validator');
var HomePanel = require('./HomePanel');




var SubscriptionList = React.createClass({
    mixins: [ReactFireMixin],
    contextTypes: {
        authData: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            friends: null,
            emailState: null,
        };
    },

    componentWillMount() {
        this.friendRef = firebaseRef.child('users').child(this.context.authData.uid).child('friends');
        this.bindAsObject(this.friendRef, 'friends');
    },

    renderFriends() {
        if (!this.state.friends) {
            return;
        }
        var subs = [];
        var friends = this.state.friends;
        for (var key in friends) {
            if (key != '.key' && key != '.value') {
                var data = friends[key];
                subs.push({
                    name: data.name || data.email,
                    uid: key,
                    confirmed: data.confirmed,
                });
            }
        }

        return (
            <ListGroup>
                {subs.map(sub => {
                    return (
                        <ListGroupItem key={sub.uid}>{sub.name} - {data.confirmed ? null : '(Pending)'}</ListGroupItem>
                    )
                })}
            </ListGroup>
        );
    },

    addFriend(event) {
        event.preventDefault();
        var email = this.refs.friendInput.getValue();
        if (!emailValidator.validate(email)) {
            return;
        }

        this.friendRef.push({
            email: email,
            confirmed: false,
        }, (e) => {
            if (e) {
                console.log(e);
            }
        });
    },

    validateEmail() {
        var email = this.refs.friendInput.getValue();
        if (email.length && !emailValidator.validate(email)) {
            return 'error';
        }
        return;
    },

    emailChange() {
        this.setState({
            emailState: this.validateEmail(),
        });
    },

    renderInput() {
        return (
            <form style={{
                marginBottom: 20,
            }} onSubmit={this.addFriend}>
                <Input
                    bsStyle={this.state.emailState}
                    type="text"
                    onChange={this.emailChange}
                    placeholder="Add a friend by email"
                    ref="friendInput"
                    buttonAfter={
                        <Button type="submit">Send Invite</Button>
                    }
                />
            </form>
        );
    },

    render() {
        return (
            <HomePanel>
                <h3>Your Friends</h3>
                {this.renderInput()}
                {this.renderFriends()}
            </HomePanel>
        );
    },
});

module.exports = SubscriptionList;