var React = require('react');
var { Input } = require('react-bootstrap');
var emailValidator = require('email-validator');



var EmailForm = React.createClass({
    validateEmail() {
        var email = this.props.value;
        if (email.length && !emailValidator.validate(email)) {
            return 'error';
        }
        return;
    },

    getValue() {
        return this.refs.email.getValue();
    },

    render() {
        return (
            <Input {...this.props} ref="email" type="email" label="Email" placeholder="Email" bsStyle={this.validateEmail()} />
        );
    },
});

module.exports = EmailForm;