var React = require('react');
var { FormControl, FormGroup, Button, Alert, Checkbox } = require('react-bootstrap');
var LoadingOverlay = require('./LoadingOverlay');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');

var SettingsPage = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object.isRequired,
        userData: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            userData: {
                ...this.context.userData,
            },
            loading: false,
            saved: false,
        };
    },

    onFormChange(key, e) {
        this.setState({
            userData: {
                ...this.state.userData,
                [key]: e.target.value,
            },
        });
    },

    onToggleChange(key) {
        this.setState({
            userData: {
                ...this.state.userData,
                [key]: !this.state.userData[key],
            },
        });
    },

    onSave(e) {
        e.preventDefault();

        this.setState({
            loading: true,
            error: null,
        });

        var userRef = firebaseRef.child('users').child(this.context.authData.uid);

        Promise.all([
            userRef.child('fullname').set(this.state.userData.fullname),
            userRef.child('emailChallengeRankChange').set(this.state.userData.emailChallengeRankChange),
            userRef.child('emailChallengeChange').set(this.state.userData.emailChallengeChange),
        ]).then(() => {
            this.setState({
                saved: true,
            });
        }).catch((error) => {
            this.setState({
                error: error.code,
            });
        }).then(() => {
            this.setState({
                loading: false,
            });
        });
    },

    onSavedDismiss() {
        this.setState({
            saved: false,
        });
    },

    render() {
        return (
            <div>
                {this.state.saved ? (
                    <Alert
                        onDismiss={this.onSavedDismiss}
                        bsStyle="success">
                        Your profile has been updated
                    </Alert>
                ) : null}
                {this.state.error ? (
                    <Alert
                        onDismiss={() => {
                            this.setState({
                                error: null,
                            });
                        }}
                        bsStyle="danger">
                        {this.state.error}
                    </Alert>
                ) : null}
                <LoadingOverlay isOpened={this.state.loading} />
                <h3>Settings</h3>
                <form onSubmit={this.onSave}>
                    <FormGroup>
                        <FormControl
                            ref="fullname"
                            type="text"
                            label="Full name"
                            placeholder="Full name"
                            value={this.state.userData.fullname}
                            onChange={this.onFormChange.bind(this, 'fullname')}
                        />
                    </FormGroup>
                    <h3>Emails</h3>
                    <Checkbox
                        onChange={this.onToggleChange.bind(this, 'emailChallengeRankChange')}
                        checked={this.state.userData.emailChallengeRankChange}>
                        Send email when the rankings of a challenge changes
                    </Checkbox>
                    <Checkbox
                        onChange={this.onToggleChange.bind(this, 'emailChallengeChange')}
                        checked={this.state.userData.emailChallengeChange}>
                        Send email when challenge has an update
                    </Checkbox>
                    <Button type="submit" bsStyle="primary" style={{marginTop: 20}}>
                        Save
                    </Button>
                </form>
            </div>
        );
    },
});

module.exports = SettingsPage;