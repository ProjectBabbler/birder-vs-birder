var React = require('react');
var Signup = require('./Signup');
var { browserHistory } = require('react-router');
var { Panel, Button } = require('react-bootstrap');
var { LinkContainer } = require('react-router-bootstrap');



var SignupPage = React.createClass({
    onSignup() {
        browserHistory.push({
            pathname: '/',
        });
    },

    render() {
        return (
            <div style={{
                display: 'flex',
            }}>
                <Panel header="Sign Up" style={{
                    flexGrow: 1,
                }}>
                    <Signup onSignup={this.onSignup} />
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

module.exports = SignupPage;