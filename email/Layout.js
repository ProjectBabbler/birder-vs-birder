var React = require('react');

var Layout = function Layout(props) {
    var baseStyle = {
        width: '100% !important',
        height: '100%',
        margin: 0,
        lineHeight: 1.4,
        backgroundColor: '#F2F4F6',
        color: '#74787E'
    };

    /* Layout ------------------------------ */
    var emailWrapper = {
        width: '100%',
        margin: 0,
        padding: 0,
        backgroundColor: '#F2F4F6'
    };

    var emailContent = {
        width: '100%',
        margin: 0,
        padding: 0
    };

    /* Masthead ----------------------- */
    var emailMasthead = {
        padding: '25px 0',
        textAlign: 'center'
    };

    var emailMastheadName = {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#bbbfc3',
        textDecoration: 'none',
        textShadow: '0 1px 0 white'
    };

    /* Body ------------------------------ */
    var emailBody = {
        width: '100%',
        margin: 0,
        padding: 0,
        borderTop: '1px solid #EDEFF2',
        borderBottom: '1px solid #EDEFF2',
        backgroundColor: '#FFF'
    };

    var emailBodyInner = {
        width: 570,
        margin: '0 auto',
        padding: 0
    };

    var emailFooter = {
        width: 570,
        margin: '0 auto',
        padding: 0,
        textAlign: 'center'
    };

    var emailFooterP = {
        color: '#AEAEAE',
        marginTop: 0,
        lineHeight: '1.5em',
        fontSize: 12,
        textAlign: 'center'
    };

    var contentCell = {
        padding: 35
    };

    return React.createElement(
        'html',
        null,
        React.createElement(
            'body',
            null,
            React.createElement(
                'div',
                { style: baseStyle },
                React.createElement(
                    'table',
                    { style: emailWrapper, width: '100%', cellPadding: '0', cellSpacing: '0' },
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            { align: 'center' },
                            React.createElement(
                                'table',
                                { style: emailContent, width: '100%', cellPadding: '0', cellSpacing: '0' },
                                React.createElement(
                                    'tr',
                                    null,
                                    React.createElement(
                                        'td',
                                        { style: emailMasthead },
                                        React.createElement(
                                            'a',
                                            { style: emailMastheadName },
                                            'Birder Vs Birder'
                                        )
                                    )
                                ),
                                React.createElement(
                                    'tr',
                                    null,
                                    React.createElement(
                                        'td',
                                        { style: emailBody, width: '100%' },
                                        React.createElement(
                                            'table',
                                            { style: emailBodyInner, align: 'center', width: '570', cellPadding: '0', cellSpacing: '0' },
                                            React.createElement(
                                                'tr',
                                                null,
                                                props.children
                                            )
                                        )
                                    )
                                ),
                                React.createElement(
                                    'tr',
                                    null,
                                    React.createElement(
                                        'td',
                                        null,
                                        React.createElement(
                                            'table',
                                            { style: emailFooter, align: 'center', width: '570', cellPadding: '0', cellSpacing: '0' },
                                            React.createElement(
                                                'tr',
                                                null,
                                                React.createElement(
                                                    'td',
                                                    { style: contentCell },
                                                    React.createElement(
                                                        'p',
                                                        { style: emailFooterP },
                                                        '© 2016 Birder Vs Birder. All rights reserved.'
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    );
};

module.exports = Layout;