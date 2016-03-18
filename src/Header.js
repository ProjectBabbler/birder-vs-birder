var React = require('react');
var { Nav, Navbar, NavItem } = require('react-bootstrap');
var { LinkContainer } = require('react-router-bootstrap');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var { Link } = require('react-router');
var Donate = require('./Donate');

var Header = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
        userData: React.PropTypes.object,
    },

    logOut() {
        firebaseRef.unauth();
    },

    getNavItems() {
        var navItems = [];

        if (!this.context.authData) {
            navItems.push(
                <LinkContainer key="signin" to={{ pathname: '/signin' }}>
                    <NavItem eventKey={1}>Sign In</NavItem>
                </LinkContainer>
            );
            navItems.push(
                <LinkContainer key="signup" to={{ pathname: '/signup' }}>
                    <NavItem eventKey={2}>Sign Up</NavItem>
                </LinkContainer>
            );
        } else if (this.context.userData) {
            navItems.push(
                <NavItem key="log out" onClick={this.logOut}>
                    Log out of {this.context.userData.ebird_username}
                </NavItem>
            );
            navItems.push(
                <NavItem key="donate">
                    <Donate />
                </NavItem>
            );
        }

        return navItems;
    },

    render() {
        return (
            <Navbar fixedTop={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to={{ pathname: '/' }}>
                            Birder Vs Birder
                        </Link>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav pullRight={true}>
                    {this.getNavItems()}
                </Nav>
            </Navbar>
        );
    },
});

module.exports = Header;