var React = require('react');
var { FormControl, FormGroup } = require('react-bootstrap');
var emailValidator = require('email-validator');



var EmailForm = React.createClass({
    validateEmail() {
        var email = this.props.value;
        if (email.length && !emailValidator.validate(email)) {
            return 'error';
        }
        return;
    },

    render() {
        return (
            <FormGroup validationState={this.validateEmail()}>
                <FormControl {...this.props} ref="email" type="email" label="Email" placeholder="Email" />
            </FormGroup>
        );
    },
});

module.exports = EmailForm;