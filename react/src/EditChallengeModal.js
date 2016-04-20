var React = require('react');
var CreateChallengeModal = require('./CreateChallengeModal');
var birdLocations = require('bird-locations');

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
        birdLocations.getByCode(this.props.challenge.code).then(loc => {
            this.setState({
                location: {
                    value: this.props.challenge.code,
                    label: birdLocations.getNiceName(loc),
                    location: loc,
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