var React = require('react');
var Header = require('./Header');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');
var axios = require('axios');

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
        this.listenForUserData();
        firebaseRef.onAuth(this.onAuthCallback);
    },

    listenForUserData() {
        if (this.state.authData) {
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
        /*
        axios.post('/api/ebirdListScrape', {
            userId: authData.uid,
        }).then((result) => {
        }).catch((err) => {
            console.log(err);
        });
        /*axios.post('/api/ebirdScrape', {
            userId: authData.uid,
        }).then((result) => {
        }).catch((err) => {
            console.log(err);
        });*/

        this.setState({
            authData: authData,
        }, this.listenForUserData);
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