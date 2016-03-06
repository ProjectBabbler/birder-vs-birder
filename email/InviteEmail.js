'use strict';

var Layout = require('./Layout');
var React = require('react');

var InviteEmail = function InviteEmail(props) {
    var body = {
        width: '100%',
        margin: '30px auto',
        padding: 0,
        textAlign: 'center'
    };

    var button = {
        display: 'inline-block',
        width: 200,
        backgroundColor: '#22BC66',
        borderRadius: 3,
        color: '#ffffff',
        fontSize: 15,
        lineHeight: '45px',
        textAlign: 'center',
        textDecoration: 'none'
    };

    return React.createElement(
        Layout,
        null,
        React.createElement(
            'h3',
            null,
            'You\'ve been invited to a birder vs birder challenge'
        ),
        React.createElement(
            'h4',
            null,
            props.challenge.time,
            ' list for ',
            props.challenge.code
        ),
        React.createElement(
            'table',
            { style: body, align: 'center', width: '100%', cellPadding: '0', cellSpacing: '0' },
            React.createElement(
                'tr',
                null,
                React.createElement(
                    'td',
                    { align: 'center' },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'a',
                            { style: button },
                            'Accept Challenge'
                        )
                    )
                )
            )
        )
    );
};

module.exports = InviteEmail;