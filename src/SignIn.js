var React = require('react');
var { Panel, Input, ButtonInput, Alert } = require('react-bootstrap');
var axios = require('axios');
var { browserHistory } = require('react-router');
var LoadingOverlay = require('./LoadingOverlay');

var SignIn = React.createClass({
    getInitialState() {
        return {
            username: '',
            password: '',
            loading: false,
            error: '',
        };
    },

    onUsernameChange(value) {
        this.setState({
            username: this.refs.username.getValue(),
        });
    },

    onPasswordChange(value) {
        this.setState({
            password: this.refs.password.getValue(),
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

    render() {
        return (
            <Panel header="Birder Vs Birder Sign In">
                <LoadingOverlay isOpened={this.state.loading} />
                {this.state.error ? (
                    <Alert bsStyle="danger">
                        {this.state.error || 'Sorry, something went wrong'}
                    </Alert>
                ) : null}
                <form onSubmit={this.onSubmit}>
                    <Input ref="username" name="name" type="text" label="Username" placeholder="Enter Ebird Username" value={this.state.username} onChange={this.onUsernameChange} />
                    <Input ref="password" name="password" type="password" label="Password" placeholder="Enter Ebird Password" value={this.state.password} onChange={this.onPasswordChange} />
                    <ButtonInput type="submit" bsStyle="primary" value="Sign In" />
                </form>
            </Panel>
        );
    },
});

module.exports = SignIn;