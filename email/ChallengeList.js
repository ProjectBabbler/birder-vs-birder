var React = require('react');

var renderRow = (userKey, change, i) => {
    var styles = {
        baseStyles: {
            fontSize: '16px',
            borderTop: '1px solid #d7d7d7',
            height: 60,
        },
        evenRow: {
            backgroundColor: '#ececec',
        },
        oddRow: {
            backgroundColor: '#f9f9f9',
        },
    };


    var nameStyles;
    if (userKey == change.userKey) {
        nameStyles = {
            fontWeight: 'bold',
        };
    }

    var totalString;
    if (change.currentTotal != change.lastTotal) {
        totalString = `(added ${change.currentTotal - change.lastTotal} from yesterday)`;
    }
    var diff = change.lastIndex - change.currentIndex;
    var diffArrow;
    if (diff != 0) {
        var diffStyle = {
            margin: 5,
            fontSize: '12px',
        };
        if (diff > 0) {
            diffArrow = (
                <span style={{
                    ...diffStyle,
                    color: '#86b400'
                }}>
                    <img src="http://www.birdervsbirder.com/static/images/movementUp.png" />
                    {diff}
                </span>
            );
        } else {
            diffArrow = (
                <span style={{
                    ...diffStyle,
                    color: '#c60000'
                }}>
                    <img src="http://www.birdervsbirder.com/static/images/movementDown.png" />
                    {diff}
                </span>
            );
        }
    }

    var rowStyle = i % 2 == 0 ? styles.evenRow : styles.oddRow;

    return (
        <tr style={{
            ...styles.baseStyles,
            ...rowStyle
        }}>
            <td style={{
                whiteSpace: 'nowrap',
            }}>
                {change.currentIndex + 1}
                {diffArrow}
            </td>
            <td style={nameStyles}>
                {change.name}
            </td>
            <td>
                {change.currentTotal} {totalString}
            </td>
        </tr>
    );
};

var ChallengeMetaData = (props) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {props.changes.map(renderRow.bind(this, props.userKey))}
            </tbody>
        </table>
    );
};

module.exports = ChallengeMetaData;