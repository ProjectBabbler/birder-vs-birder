var React = require('react');

var AuthWrapper = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
    },

    render() {
        if (this.context.authData && this.context.authData.uid) {
            return this.props.children;
        } else {
            return <div />;
        }
    },
});

module.exports = AuthWrapper;