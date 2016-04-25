var React = require('react');
var cookie = require('cookie-dough')();
var Radium = require('radium');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

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
        return (
            <MuiThemeProvider muiTheme={getMuiTheme({}, {
                userAgent: this.props.userAgent,
            })}>
                {this.props.children}
            </MuiThemeProvider>
        );
    },
}));

module.exports = ContextProvider;