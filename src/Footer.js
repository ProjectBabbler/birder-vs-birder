var React = require('react');

var Footer = React.createClass({
    render() {
        return (
            <div style={{
                padding: '25px 0',
                backgroundColor: '#233140',
                textAlign: 'center',
                color: 'white',
            }}>
                Copyright © Birder vs Birder
            </div>
        );
    },
});

module.exports = Footer;