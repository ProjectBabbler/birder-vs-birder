var React = require('react');

var SectionList = function SectionList(props) {
    if (!props.lineItems.length) {
        return React.createElement(
            'p',
            null,
            'Sorry no updates for your ',
            props.list,
            ' list this week.  Good luck birding.'
        );
    }

    var renderRow = function renderRow(row) {
        return React.createElement(
            'tr',
            null,
            React.createElement(
                'td',
                null,
                row.name
            ),
            React.createElement(
                'td',
                null,
                row.oldLife,
                ' -> ',
                row.newLife
            ),
            React.createElement(
                'td',
                null,
                row.oldYear,
                ' -> ',
                row.newYear
            )
        );
    };

    return React.createElement(
        'table',
        null,
        React.createElement(
            'p',
            null,
            'Nice job on your ',
            props.list,
            ' lists.  Here are all the places you got new birds.'
        ),
        React.createElement(
            'table',
            null,
            React.createElement(
                'thead',
                null,
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        null,
                        'Name'
                    ),
                    React.createElement(
                        'th',
                        null,
                        'Life Total'
                    ),
                    React.createElement(
                        'th',
                        null,
                        'Year Total'
                    )
                )
            ),
            React.createElement(
                'tbody',
                null,
                props.lineItems.map(renderRow)
            )
        )
    );
};

module.exports = SectionList;