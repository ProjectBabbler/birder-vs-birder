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

    getValue() {
        return this.refs.email.getValue();
    },

    render() {
        return (
            <FormGroup>
                <FormControl {...this.props} ref="email" type="email" label="Email" placeholder="Email" bsStyle={this.validateEmail()} />
            </FormGroup>
        );
    },
});

module.exports = EmailForm;