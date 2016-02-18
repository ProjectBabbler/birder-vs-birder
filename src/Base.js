var React = require('react');
var Header = require('./Header');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');

var Base = React.createClass({
    mixins: [ReactFireMixin],

    childContextTypes: {
        authData: React.PropTypes.object,
        userData: React.PropTypes.object,
    },

    getChildContext: function() {
        return {
            authData: this.state.authData,
            userData: this.state.userData,
        };
    },

    getInitialState() {
        return {
            authData: null,
            userData: null,
        };
    },

    componentDidMount() {
        this.getUserData();
        firebaseRef.onAuth(this.onAuthCallback);
    },

    getUserData() {
        if (this.state.authData) {
            var ref = firebaseRef.child('users').child(this.state.authData.uid);
            this.bound = true;
            this.bindAsObject(ref, 'userData');
        } else {
            if (this.bound) {
                this.unbind('userData');
                this.bound = false;
            }
            this.setState({
                userData: null,
            });
        }
    },

    onAuthCallback(authData) {
        this.setState({
            authData: authData,
        }, this.getUserData);
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