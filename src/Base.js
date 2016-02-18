var React = require('react');
var Header = require('./Header');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');

var Base = React.createClass({
    childContextTypes: {
        authData: React.PropTypes.object,
    },

    getChildContext: function() {
        return {
            authData: this.state.authData
        };
    },

    getInitialState() {
        return {
            authData: null,
        };
    },

    componentDidMount() {
        firebaseRef.onAuth(this.onAuthCallback);
    },

    onAuthCallback(authData) {
        this.setState({
            authData: authData,
        });
    },

    componentDidUnMount() {
        firebaseRef.offAuth(this.onAuthCallback);
    },

    render () {
        return (
            <div style={{
                maxWidth: 1170,
                margin: 'auto'
            }}>
                <div style={{
                    marginBottom: 100,
                }}>
                    <Header />
                </div>
                {this.props.children}
            </div>
        );
    }
});

module.exports = Base;