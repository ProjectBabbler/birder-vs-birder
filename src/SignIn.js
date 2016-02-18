var React = require('react');
var { Panel, Input, ButtonInput, Alert, Button } = require('react-bootstrap');
var axios = require('axios');
var { browserHistory } = require('react-router');
var LoadingOverlay = require('./LoadingOverlay');
var { LinkContainer } = require('react-router-bootstrap');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');


var SignIn = React.createClass({
    getInitialState() {
        return {
            username: '',
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
            email: this.state.username,
            password: this.state.password,
        }).then(() => {
            browserHistory.push({
                pathname: '/',
            });
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
            <div style={{
                display: 'flex',
            }}>
                <Panel header="Sign In" style={{
                    flexGrow: 1,
                }}>
                    <LoadingOverlay isOpened={this.state.loading} />
                    {this.state.error ? (
                        <Alert bsStyle="danger">
                            {this.state.error || 'Sorry, something went wrong'}
                        </Alert>
                    ) : null}
                    <form onSubmit={this.onSubmit}>
                        <Input ref="username" type="text" label="Username" placeholder="Enter Ebird Username" value={this.state.username} onChange={this.onFormChange.bind(this, 'username')} required />
                        <Input ref="password" name="password" type="password" label="Password" placeholder="Enter Ebird Password" value={this.state.password} onChange={this.onFormChange.bind(this, 'password')} required />
                        <ButtonInput type="submit" bsStyle="primary" value="Sign In" />
                    </form>
                </Panel>
                <Panel header="Don't have an account?" bsStyle="info" style={{
                    marginLeft: 20,
                    width: 300,
                }}>
                    It's quick and easy.  Just sign up here.
                    <LinkContainer to={{ pathname: '/signup' }}>
                        <Button style={{
                            marginTop: 20,
                        }}>Sign Up</Button>
                    </LinkContainer>
                </Panel>
            </div>
        );
    },
});

module.exports = SignIn;