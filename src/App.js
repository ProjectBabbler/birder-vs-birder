var React = require('react');
var Dashboard = require('./Dashboard');
var WelcomePage = require('./WelcomePage');
var MainContent = require('./MainContent');


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

module.exports = App;