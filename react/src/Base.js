var React = require('react');
var Header = require('./Header');
var ReactFireMixin = require('reactfire');
var Footer = require('./Footer');
var Ad = require('./Ad');
var cookie = require('cookie-dough')();
var UserUtils = require('../utils/UserUtils');

var firebase = require('../firebase');
var firebaseRef = firebase.database();

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
            userData: UserUtils.populateWithDefaults(this.state.userData),
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
        firebase.auth().onAuthStateChanged(this.onAuthCallback);
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
            var ref = firebaseRef.ref('users').child(this.state.authData.uid);
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

module.exports = Base;