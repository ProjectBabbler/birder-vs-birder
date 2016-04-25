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
            if (this.context.authData.uid) {
                return (
                    <MainContent>
                        <Dashboard />
                    </MainContent>
                );
            } else {
                // authData isn't stored serverside so only load content once uid is set.
                return <div />;
            }
        } else {
            return <WelcomePage />;
        }
    },
});

module.exports = App;