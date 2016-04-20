var React = require('react');
var Header = require('./Header');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');
var Footer = require('./Footer');
var Ad = require('./Ad');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
var cookie = require('cookie-dough')();

var Base = React.createClass({
    mixins: [ReactFireMixin],

    contextTypes: {
        signedIn: React.PropTypes.bool,
    },

    childContextTypes: {
        authData: React.PropTypes.object,
        userData: React.PropTypes.object,
    },

    getChildContext() {
        return {
            authData: this.state.authData,
            userData: this.state.userData,
        };
    },

    getInitialState() {
        return {
            authData: this.context.signedIn ? {} : null,
            userData: null,
            adKey: 0,
        };
    },

    componentDidMount() {
        this.listenForUserData();
        firebaseRef.onAuth(this.onAuthCallback);
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.location != nextProps.location) {
            this.updateAd();
        }
    },

    updateAd() {
        this.setState({
            adKey: this.state.adKey + 1,
        });
    },

    listenForUserData() {
        if (this.state.authData && this.state.authData.uid) {
            var ref = firebaseRef.child('users').child(this.state.authData.uid);
            if (!this.bound) {
                this.bindAsObject(ref, 'userData');
                this.bound = true;
            }
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
        cookie.set('signedIn', !!(authData != null));
        this.setState({
            authData: authData,
        }, this.listenForUserData);
    },

    componentWillUnmount() {
        firebaseRef.offAuth(this.onAuthCallback);
    },

    render() {
        return (
            <div>
                <Header />
                {this.props.children}
                <div style={{
                    marginTop: 20,
                    marginBottom: 20,
                }}>
                    <Ad slot="4309409562" key={this.state.adKey} />
                </div>
                <Footer />
            </div>
        );
    }
});

var Wrapper = React.createClass({
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <Base {...this.props} />
            </MuiThemeProvider>
        );
    },
});

module.exports = Wrapper;