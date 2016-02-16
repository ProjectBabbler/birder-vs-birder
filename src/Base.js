var React = require('react');

var Base = (props) => {
    return (
        <div style={{
            maxWidth: 1170,
            margin: 'auto'
        }}>
            <div style={{
                marginTop: 20,
                marginBottom: 50,
            }}>
                Header Goes Here
            </div>
            {props.children}
        </div>
    );
};

module.exports = Base;