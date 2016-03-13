var React = require('react');

var MainContent = (props) => {
    return (
        <div style={{
            maxWidth: 1170,
            marginTop: 100,
            marginLeft: 'auto',
            marginRight: 'auto',
        }}>
            {props.children}
        </div>
    );
};

module.exports = MainContent;