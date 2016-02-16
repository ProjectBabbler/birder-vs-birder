var React = require('react');
var SignIn = require('./SignIn');

var App = React.createClass({
    render() {
        return (
            <div>
                <SignIn />
            </div>
        );
    },
});

module.exports = App;