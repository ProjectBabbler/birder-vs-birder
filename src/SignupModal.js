var React = require('react');
var Signup = require('./Signup');
var { Modal } = require('react-bootstrap');

var SignupModal = React.createClass({
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.close}>
                <Modal.Header closeButton={true}>
                    <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Signup onSignup={this.props.onSignup} />
                </Modal.Body>
            </Modal>
        );
    },
});

module.exports = SignupModal;