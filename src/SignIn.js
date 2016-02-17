var React = require('react');
var { Panel, Input, ButtonInput } = require('react-bootstrap');

var SignIn = React.createClass({
    getInitialState() {
        return {
            username: '',
            password: '',
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

    render() {
        return (
            <Panel header="Birder Vs Birder Sign In">
                <form action="/rest/gumroad/store" method="post">
                    <Input ref="username" name="name" type="text" label="Username" placeholder="Enter Ebird Username" value={this.state.username} onChange={this.onUsernameChange} />
                    <Input ref="password" name="password" type="text" label="Password" placeholder="Enter Ebird Password" value={this.state.password} onChange={this.onPasswordChange} />
                    <ButtonInput type="submit" bsStyle="primary" value="Sign In" />
                </form>
            </Panel>
        );
    },
});

module.exports = SignIn;