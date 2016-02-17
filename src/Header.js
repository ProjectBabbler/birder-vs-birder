var React = require('react');
var { Nav, Navbar, NavItem } = require('react-bootstrap');
var { LinkContainer } = require('react-router-bootstrap');

var Header = React.createClass({
    render() {
        return (
            <Navbar fixedTop={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#">Birder Vs Birder</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav pullRight={true}>
                    <LinkContainer to={{ pathname: '/signin' }}>
                        <NavItem eventKey={1}>Sign In</NavItem>
                    </LinkContainer>
                    <LinkContainer to={{ pathname: '/signup' }}>
                        <NavItem eventKey={2}>Sign Up</NavItem>
                    </LinkContainer>
                    <LinkContainer to={{ pathname: '/about' }}>
                        <NavItem eventKey={3}>About</NavItem>
                    </LinkContainer>
                </Nav>
            </Navbar>
        );
    },
});

module.exports = Header;