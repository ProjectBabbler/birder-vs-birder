var React = require('react');
var cookie = require('cookie-dough')();
var Radium = require('radium');

var ContextProvider = Radium(React.createClass({
    childContextTypes: {
        signedIn: React.PropTypes.bool,
    },

    getChildContext() {
        var signedIn = this.props.signedIn;
        if (process.env.BROWSER) {
            signedIn = cookie.get('signedIn') == 'true';
        }
        return {
            signedIn: signedIn,
        };
    },

    render() {
        return this.props.children;
    },
}));

module.exports = ContextProvider;