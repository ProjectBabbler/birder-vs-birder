var React = require('react');
var Header = require('./Header');

var Base = (props) => {
    return (
        <div style={{
            maxWidth: 1170,
            margin: 'auto'
        }}>
            <div style={{
                marginBottom: 100,
            }}>
                <Header />
            </div>
            {props.children}
        </div>
    );
};

module.exports = Base;