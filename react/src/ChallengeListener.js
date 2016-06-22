var React = require('react');
var ReactFireMixin = require('reactfire');

var firebase = require('../firebase');
var firebaseRef = firebase.database();


var ChallengeListener = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState() {
        return {
            challenge: null,
        };
    },

    componentWillMount() {
        var challengeRef = firebaseRef.ref('challenges').child(this.props.id);
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