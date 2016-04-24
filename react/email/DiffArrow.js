var React = require('react');

var DiffArrow = (props) => {
    var diff =  props.current - props.last;
    if (props.rank) {
        diff =  props.last - props.current;
    }
    var diffStyle = {
        margin: 5,
        fontSize: '12px',
    };

    if (diff != 0) {
        if (diff > 0) {
            return (
                <span style={{
                    ...diffStyle,
                    color: '#86b400'
                }}>
                    {props.rank ? (
                        <img src="http://www.birdervsbirder.com/static/images/movementUp.png" />
                    ) : '+'}
                    {diff}
                </span>
            );
        } else {
            return (
                <span style={{
                    ...diffStyle,
                    color: '#c60000'
                }}>
                    {props.rank ? (
                        <img src="http://www.birdervsbirder.com/static/images/movementDown.png" />
                    ) : '-'}
                    {diff}
                </span>
            );
        }
    }

    return <div />;
};

module.exports = DiffArrow;