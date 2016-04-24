var React = require('react');
var Styles = require('./Styles');
var DiffArrow = require('./DiffArrow');

var renderRow = (userKey, change, i) => {
    var nameStyles;
    if (userKey == change.userKey) {
        nameStyles = {
            fontWeight: 'bold',
        };
    }

    var totalString;
    if (change.currentTotal != change.lastTotal && change.lastTotal) {
        totalString = `(added ${change.currentTotal - change.lastTotal} from yesterday)`;
    }

    var diffArrow;
    var diffStyle = {
        margin: 5,
        fontSize: '12px',
    };
    if (change.lastIndex == -1) {
        diffArrow = (
            <span style={{
                ...diffStyle,
                color: 'darkgoldenrod'
            }}>
                * Joined today
            </span>
        );
    } else {
        diffArrow = <DiffArrow rank={true} last={change.lastIndex} current={change.currentIndex} />;
    }

    var rowStyle = i % 2 == 0 ? Styles.table.evenRow : Styles.table.oddRow;

    return (
        <tr key={i} style={{
            ...Styles.table.tr,
            ...rowStyle
        }}>
            <td style={{
                ...Styles.table.td,
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

var ChallengeList = (props) => {
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

module.exports = ChallengeList;