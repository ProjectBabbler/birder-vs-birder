var React = require('react');
var Signup = require('./Signup');

var SignupModal = React.createClass({
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.close}>
                <Signup onSignup={this.props.onSignup} />
            </Modal>
        );
    },
});

module.exports = SignupModal;