var React = require('react');
var Radium = require('radium');

var MenuItem = Radium(React.createClass({
    render() {
        var menuStyle = {
            display: 'block',
            padding: '3px 20px',
            clear: 'both',
            fontWeight: '400',
            lineHeight: '1.42857143',
            color: '#333',
            whiteSpace: 'nowrap',

            ':hover': {
                color: '#262626',
                textDecoration: 'none',
                backgroundColor: '#f5f5f5',
            },
        };

        return (
            <div {...this.props} style={menuStyle} />
        );
    },
}));

module.exports = MenuItem;