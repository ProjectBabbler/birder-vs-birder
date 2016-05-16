var React = require('react');
var Styles = require('./Styles');
var DiffArrow = require('./DiffArrow');

var SectionList = (props) => {
    var titleStyle = {
        fontSize: '26px',
    };

    var thStyle = {
        textAlign: 'left',
    };

    if (!props.lineItems.length) {
        return (
            <p style={titleStyle}>Sorry no updates for your {props.list} list this week.  Good luck birding.</p>
        );
    }

    var renderRow = (row, i) => {
        var rowStyle = i % 2 == 0 ? Styles.table.evenRow : Styles.table.oddRow;

        return (
            <tr
                key={i}
                style={{
                    ...Styles.table.tr,
                    ...rowStyle
                }}>
                <td style={{
                    ...Styles.table.td,
                }}>
                    {row.name}
                </td>
                <td style={{
                    ...Styles.table.td,
                }}>
                    {row.newLife} <DiffArrow last={row.oldLife} current={row.newLife} />
                </td>
                <td style={{
                    ...Styles.table.td,
                }}>
                    {row.newYear} <DiffArrow last={row.oldYear} current={row.newYear} />
                </td>
            </tr>
        );
    };

    return (
        <div>
            <p style={titleStyle}>
                Nice job on your {props.list} lists.  Here are all the places you got new birds.
            </p>
            <table style={{
                width: '100%',
            }}>
                <thead>
                    <tr>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Life Total</th>
                        <th style={thStyle}>Year Total</th>
                    </tr>
                </thead>
                <tbody>
                    {props.lineItems.map(renderRow)}
                </tbody>
            </table>
        </div>
    );
};

module.exports = SectionList;