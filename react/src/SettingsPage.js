var React = require('react');
var { FormControl, FormGroup, Button, Alert } = require('react-bootstrap');
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
            fullname: this.context.userData.fullname,
            loading: false,
            saved: false,
        };
    },

    onFormChange(e, key) {
        this.setState({
            [key]: e.target.value,
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
            userRef.child('fullname').set(this.state.fullname),
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
                        dismissAfter={2000}
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
                        <FormControl ref="fullname" type="text" label="Full name" placeholder="Full name" value={this.state.fullname} onChange={this.onFormChange.bind(this, 'fullname')} />
                    </FormGroup>
                    <Button type="submit" bsStyle="primary">
                        Save
                    </Button>
                </form>
            </div>
        );
    },
});

module.exports = SettingsPage;