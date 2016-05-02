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
            <td style={{
                ...Styles.table.td,
                ...nameStyles
            }}>
                {change.name}
            </td>
            <td style={{
                ...Styles.table.td,
            }}>
                {change.currentTotal} <DiffArrow last={change.lastTotal} current={change.currentTotal} />
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