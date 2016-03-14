var React = require('react');

var SectionList = (props) => {
    if (!props.lineItems.length) {
        return (
            <p>Sorry no updates for your {props.list} list this week.  Good luck birding.</p>
        );
    }

    var renderRow = (row) => {
        return (
            <tr>
                <td>{row.name}</td>
                <td>{row.newLife} +{row.newLife - row.oldLife}</td>
                <td>{row.newYear} +{row.newYear - row.oldYear}</td>
            </tr>
        );
    };

    return (
        <table>
            <p>Nice job on your {props.list} lists.  Here are all the places you got new birds.</p>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Life Total</th>
                        <th>Year Total</th>
                    </tr>
                </thead>
                <tbody>
                    {props.lineItems.map(renderRow)}
                </tbody>
            </table>
        </table>
    );
};

module.exports = SectionList;