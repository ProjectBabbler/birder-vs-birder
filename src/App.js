var React = require('react');
var Dashboard = require('./Dashboard');
var WelcomePage = require('./WelcomePage');
var MainContent = require('./MainContent');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';



var App = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
    },

    render() {
        if (this.context.authData) {
            return (
                <MainContent>
                    <Dashboard />
                </MainContent>
            );
        } else {
            return <WelcomePage />;
        }
    },
});

var Wrapper = React.createClass({
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <App {...this.props} />
            </MuiThemeProvider>
        );
    },
});

module.exports = Wrapper;