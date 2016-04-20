var React = require('react');
var SignIn = require('./SignIn');
var { browserHistory } = require('react-router');
var { Panel, Button } = require('react-bootstrap');
var { LinkContainer } = require('react-router-bootstrap');




var SignInPage = React.createClass({
    onSignIn() {
        browserHistory.push({
            pathname: '/',
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
                    <SignIn onSignIn={this.onSignIn} />
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

module.exports = SignInPage;