var React = require('react');
var CreateChallengeModal = require('./CreateChallengeModal');

var EditChallengeModal = React.createClass({
    render() {
        var props = {
            timeFrame: this.props.challenge.time,
            name: this.props.challenge.name,
            challengeId: this.props.challengeId,
            location: {
                value: this.props.challenge.code,
                label: '',
            },
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

module.exports = EditChallengeModal;