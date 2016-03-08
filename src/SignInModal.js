var React = require('react');
var SignIn = require('./SignIn');
var { Modal } = require('react-bootstrap');

var SignInModal = React.createClass({
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SignIn onSignIn={this.props.onSignIn} />
                </Modal.Body>
            </Modal>
        );
    },
});

module.exports = SignInModal;