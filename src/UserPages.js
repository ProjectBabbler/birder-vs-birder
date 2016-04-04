var React = require('react');

var UserPages = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
        userData: React.PropTypes.object,
    },

    render() {
        if (!this.context.authData || !this.context.userData || this.props.params.userId != this.context.authData.uid) {
            return <div/>;
        } else {
            return this.props.children;
        }
    },
});

module.exports = UserPages;