var React = require('react');
var { Input, ButtonInput, Alert, Button } = require('react-bootstrap');
var axios = require('axios');
var LoadingOverlay = require('./LoadingOverlay');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');


var SignIn = React.createClass({
    getInitialState() {
        return {
            email: '',
            password: '',
            loading: false,
            error: '',
        };
    },

    onFormChange(key) {
        this.setState({
            [key]: this.refs[key].getValue(),
        });
    },

    onSubmit(e) {
        e.preventDefault();

        this.setState({
            loading: true,
            error: '',
        });

        firebaseRef.authWithPassword({
            email: this.state.email,
            password: this.state.password,
        }).then(() => {
            this.props.onSignIn();
        }).catch((error) => {
            this.setState({
                error: error.message,
            });
        }).then(() => {
            this.setState({
                loading: false,
            });
        });
    },

    render() {
        return (
            <div>
                <LoadingOverlay isOpened={this.state.loading} />
                {this.state.error ? (
                    <Alert bsStyle="danger">
                        {this.state.error || 'Sorry, something went wrong'}
                    </Alert>
                ) : null}
                <form onSubmit={this.onSubmit}>
                    <Input ref="email" type="text" label="Email" placeholder="Enter Email" value={this.state.email} onChange={this.onFormChange.bind(this, 'email')} required />
                    <Input ref="password" name="password" type="password" label="Password" placeholder="Enter Ebird Password" value={this.state.password} onChange={this.onFormChange.bind(this, 'password')} required />
                    <ButtonInput type="submit" bsStyle="primary" value="Sign In" />
                </form>
            </div>
        );
    },
});

module.exports = SignIn;