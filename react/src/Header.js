var React = require('react');
var { Nav, Navbar, NavItem, NavDropdown, MenuItem } = require('react-bootstrap');
var { LinkContainer } = require('react-router-bootstrap');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var { Link } = require('react-router');
var Donate = require('./Donate');
import { browserHistory } from 'react-router';


var Header = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
        userData: React.PropTypes.object,
    },

    logOut() {
        firebaseRef.unauth();
        browserHistory.push({
            pathname: '/',
        });
    },

    getUserDropdown() {
        var baseUserUrl = `/user/${this.context.userData.ebird_username}`;
        return (
            <NavDropdown className="test-nav-user-dropdown" key="user" eventKey={3} title={this.context.userData.ebird_username} id="nav-dropdown">
                <LinkContainer key="profile" onlyActiveOnIndex={true} to={{ pathname: baseUserUrl }}>
                    <MenuItem className="test-profile-link" eventKey="3.1">Profile</MenuItem>
                </LinkContainer>
                <LinkContainer key="signin" to={{ pathname: '/settings' }}>
                    <MenuItem eventKey="3.2">Settings</MenuItem>
                </LinkContainer>
                <MenuItem eventKey="3.3" onClick={this.logOut}>Log out</MenuItem>
            </NavDropdown>
        );
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
                <LinkContainer onlyActiveOnIndex={true} key="dashboard" to={{ pathname: '/' }}>
                    <NavItem eventKey={3}>Dashboard</NavItem>
                </LinkContainer>
            );
            navItems.push(this.getUserDropdown());
        }

        navItems.push(
            <NavItem key="donate">
                <Donate />
            </NavItem>
        );

        return navItems;
    },

    render() {
        return (
            <Navbar fixedTop={true}>
                <Navbar.Header>
                    <Navbar.Brand className="test-nav-brand">
                        <Link to={{ pathname: '/home' }}>
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