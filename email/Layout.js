var React = require('react');

var Layout = (props) => {
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

    return (
        <html>
            <body>
                <div style={baseStyle}>
                    <table style={emailWrapper} width="100%" cellPadding="0" cellSpacing="0">
                        <tr>
                            <td align="center">
                                <table style={emailContent} width="100%" cellPadding="0" cellSpacing="0">
                                    <tr>
                                        <td style={emailMasthead}>
                                            <a style={emailMastheadName}>Birder Vs Birder</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={emailBody} width="100%">
                                            <table style={emailBodyInner} align="center" width="570" cellPadding="0" cellSpacing="0">
                                                <tr>{props.children}</tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table style={emailFooter} align="center" width="570" cellPadding="0" cellSpacing="0">
                                                <tr>
                                                    <td style={contentCell}>
                                                        <p style={emailFooterP}>© 2016 Birder Vs Birder. All rights reserved.</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </body>
        </html>
    );
};

module.exports = Layout;