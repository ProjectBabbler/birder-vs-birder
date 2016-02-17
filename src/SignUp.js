var React = require('react');
var { Panel, Input, ButtonInput, Alert, Button } = require('react-bootstrap');
var axios = require('axios');
var { browserHistory } = require('react-router');
var LoadingOverlay = require('./LoadingOverlay');
var { LinkContainer } = require('react-router-bootstrap');
var emailValidator = require('email-validator');


var SignIn = React.createClass({
    getInitialState() {
        return {
            username: '',
            password: '',
            fullname: '',
            email: '',
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
        this.setState({
            loading: true,
            error: '',
        });

        axios.post('/api/ebirdLogin', {
            username: this.state.username,
            password: this.state.password,
        }).then(() => {
            console.log('successful ebird login');
            browserHistory.push({
                pathname: '/',
            });
        }).catch((error) => {
            this.setState({
                loading: false,
                password: '',
                error: error.data.message,
            });
        });

        e.preventDefault();
    },

    validateEmail() {
        var email = this.state.email;
        if (email.length && !emailValidator.validate(email)) {
            return 'error';
        }
        return;
    },

    render() {
        return (
            <div style={{
                display: 'flex',
            }}>
                <Panel header="Sign Up" style={{
                    flexGrow: 1,
                }}>
                    <LoadingOverlay isOpened={this.state.loading} />
                    {this.state.error ? (
                        <Alert bsStyle="danger">
                            {this.state.error || 'Sorry, something went wrong'}
                        </Alert>
                    ) : null}
                    <form onSubmit={this.onSubmit}>
                        <Input ref="email" type="email" label="Email" placeholder="Email" value={this.state.email} onChange={this.onFormChange.bind(this, 'email')} bsStyle={this.validateEmail()} />
                        <Input ref="fullname" type="text" label="Full name" placeholder="Full name" value={this.state.fullname} onChange={this.onFormChange.bind(this, 'fullname')} />
                        <Input ref="username" type="text" label="Username" placeholder="Enter Ebird Username" value={this.state.username} onChange={this.onFormChange.bind(this, 'username')} />
                        <Input ref="password" name="password" type="password" label="Password" placeholder="Enter Ebird Password" value={this.state.password} onChange={this.onFormChange.bind(this, 'password')} />
                        <ButtonInput type="submit" bsStyle="primary" value="Sign Up" />
                    </form>
                </Panel>
                <Panel header="Already have an account?" bsStyle="info" style={{
                    marginLeft: 20,
                    width: 300,
                }}>
                    It's quick and easy.  Just sign up here.
                    <LinkContainer to={{ pathname: '/signIn' }}>
                        <Button style={{
                            marginTop: 20,
                        }}>Sign In</Button>
                    </LinkContainer>
                </Panel>
            </div>
        );
    },
});

module.exports = SignIn;