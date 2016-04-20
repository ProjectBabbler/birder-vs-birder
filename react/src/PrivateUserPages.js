var React = require('react');

var PrivateUserPages = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
        userData: React.PropTypes.object,
    },

    render() {
        if (!this.context.authData || !this.context.userData || this.props.params.username != this.context.userData.ebird_username) {
            return <div/>;
        } else {
            return this.props.children;
        }
    },
});

module.exports = PrivateUserPages;