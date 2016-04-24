var React = require('react');

var PrivateUserPages = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
        userData: React.PropTypes.object,
    },

    render() {
        if (!this.context.authData || !this.context.userData) {
            return <div/>;
        } else {
            return this.props.children;
        }
    },
});

module.exports = PrivateUserPages;