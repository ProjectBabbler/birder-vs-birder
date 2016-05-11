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

    var changeList;
    var diff = change.currentTotal - change.lastTotal;
    if (diff > 0) {
        changeList = change.list.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        changeList = changeList.splice(0, 3).map(s => {
            return (
                <div key={s.commonName}>{s.commonName}</div>
            );
        });
        if (diff > 3) {
            if (diff == 4) {
                changeList.push('plus 1 other');
            } else {
                changeList.push(`plus ${diff - 3} others`);
            }
        }
    }

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
            <td style={{
                ...Styles.table.td,
            }}>
                {changeList}
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
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {props.changes.map(renderRow.bind(this, props.userKey))}
            </tbody>
        </table>
    );
};

module.exports = ChallengeList;
