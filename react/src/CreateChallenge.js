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
        var button = (
            <Button
                className="test-create-challenge-button"
                bsStyle="primary"
                onClick={this.open}>
                Create Challenge
            </Button>
        );

        if (this.props.children) {
            button = React.cloneElement(React.Children.only(this.props.children), {
                onClick: this.open,
            });
        }
        return (
            <div style={this.props.style}>
                {button}
                {this.state.showModal ? (
                    <CreateChallengeModal onClose={this.close} />
                ): null}
            </div>
        );
    },
});

module.exports = CreateChallenge;