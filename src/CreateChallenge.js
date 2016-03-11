var React = require('react');
var { Button } = require('react-bootstrap');
var CreateChallengeModal = require('./CreateChallengeModal');


var CreateChallenge = React.createClass({
    getInitialState() {
        return {
            showModal: false,
        };
    },

    close() {
        this.setState(this.getInitialState());
    },

    open() {
        this.setState({
            showModal: true,
        });
    },

    render() {
        return (
            <div>
                <Button
                    bsStyle="primary"
                    onClick={this.open}>
                    Create Challenge
                </Button>
                {this.state.showModal ? (
                    <CreateChallengeModal onClose={this.close} />
                ): null}
            </div>
        );
    },
});

module.exports = CreateChallenge;