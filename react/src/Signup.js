var React = require('react');
var { Input, ButtonInput, Alert } = require('react-bootstrap');
var axios = require('axios');
var LoadingOverlay = require('./LoadingOverlay');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var EmailForm = require('./EmailForm');



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
            email: this.state.email,
            fullname: this.state.fullname,
        }).then((response) => {
            var ebirdData = response.data;
            console.log('successful ebird login');
            // Create Firebase User
            return firebaseRef.createUser({
                email: this.state.email,
                password: this.state.password,
            }).then((userData) => {
                console.log('successful created an account');
                // Log In.
                return firebaseRef.authWithPassword({
                    email: this.state.email,
                    password: this.state.password,
                });
            }).then((userData) => {
                console.log('successful logged in');
                var usersRef = firebaseRef.child('users');
                return usersRef.child(userData.uid).set({
                    email: this.state.email,
                    fullname: this.state.fullname,
                    ebird_username: this.state.username,
                    ebird_password: ebirdData.encryptedPassword,
                }).then(() => {
                    // Kick off a scrape of their data.
                    axios.post('/api/ebirdScrape', {
                        userId: userData.uid,
                    }).then((result) => {
                    }).catch((err) => {
                        console.log(err);
                    });
                });
            }).then(() => {
                this.props.onSignup();
            }).catch((error) => {
                this.setState({
                    error: error.message,
                });
            });
        }).catch((error) => {
            this.setState({
                password: '',
                error: error.data.message,
            });
        }).then(() => {
            this.setState({
                loading: false,
            });
        });

        e.preventDefault();
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
                <form id="test-signup-form" onSubmit={this.onSubmit}>
                    <EmailForm id="test-email" ref="email" value={this.state.email} onChange={this.onFormChange.bind(this, 'email')} />
                    <Input id="test-fullname" ref="fullname" type="text" label="Full name" placeholder="Full name" value={this.state.fullname} onChange={this.onFormChange.bind(this, 'fullname')} />
                    <Input id="test-username" ref="username" type="text" label="Username" placeholder="Enter Ebird Username" value={this.state.username} onChange={this.onFormChange.bind(this, 'username')} />
                    <Input id="test-password" ref="password" name="password" type="password" label="Password" placeholder="Enter Ebird Password" value={this.state.password} onChange={this.onFormChange.bind(this, 'password')} />
                    <ButtonInput type="submit" bsStyle="primary" value="Sign Up" />
                </form>
            </div>
        );
    },
});

module.exports = SignIn;
