var React = require('react');
var CreateChallengeModal = require('./CreateChallengeModal');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');

var EditChallengeModal = React.createClass({
    render() {
        var props = {
            timeFrame: this.props.challenge.time,
            name: this.props.challenge.name,
            challengeId: this.props.challengeId,
            location: this.props.location,
            members: this.props.challenge.members,
        };

        return (
            <CreateChallengeModal
                {...props}
                onClose={this.props.onClose}
                edit={true}
            />
        );
    },
});

var Wrapper = React.createClass({
    getInitialState() {
        return {
            location: null,
        };
    },

    componentWillMount() {
        firebaseRef.child('ebird/locations')
            .child(this.props.challenge.code)
            .once('value')
            .then((sub) => {
                this.setState({
                    location: {
                        value: this.props.challenge.code,
                        label: `${sub.val().name} - (${this.props.challenge.code})`,
                    },
                });
            });
    },

    render() {
        if (!this.state.location) {
            return <div />;
        }
        return <EditChallengeModal {...this.props} location={this.state.location} />;
    }
});

module.exports = Wrapper;