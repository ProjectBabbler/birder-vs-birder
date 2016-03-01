var React = require('react');
var HomePanel = require('./HomePanel');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');

var Challenge = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState() {
        return {
            challenge: null,
        };
    },

    componentWillMount() {
        var challenge = this.props.challenge;
    },

    componentWillMount() {
        var challengesRef = firebaseRef.child('challenges').child(this.props.id);
        this.bindAsObject(challengesRef, 'challenge');
    },

    render() {
        if (!this.state.challenge) {
            return <div/>;
        }

        return (
            <HomePanel>
                <h3>{this.state.challenge.name}</h3>
            </HomePanel>
        );
    },
});

module.exports = Challenge;