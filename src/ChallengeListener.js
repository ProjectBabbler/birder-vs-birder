var React = require('react');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');


var ChallengeListener = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState() {
        return {
            challenge: null,
        };
    },

    componentWillMount() {
        var challengeRef = firebaseRef.child('challenges').child(this.props.id);
        this.bindAsObject(challengeRef, 'challenge');
    },

    render() {
        return (
            <div>
                {React.Children.map(this.props.children, (child) => {
                    return React.cloneElement(child, {
                        challengeId: this.props.id,
                        challenge: this.state.challenge,
                    });
                })}
            </div>
        );
    },
});

module.exports = ChallengeListener;