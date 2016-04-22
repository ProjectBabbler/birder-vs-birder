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

    var donateButton = {
        display: 'inline-block',
        width: 70,
        backgroundColor: '#22BC66',
        borderRadius: 3,
        color: '#ffffff',
        fontSize: 12,
        lineHeight: '45px',
        textAlign: 'center',
        textDecoration: 'none'
    };

    var donateStyle = {
        marginBottom: '10px',
    };

    return (
        <html>
            <body>
                <div style={baseStyle}>
                    <table style={emailWrapper} width="100%" cellPadding="0" cellSpacing="0">
                        <tbody>
                            <tr>
                                <td align="center">
                                    <table style={emailContent} width="100%" cellPadding="0" cellSpacing="0">
                                        <tbody>
                                            <tr>
                                                <td style={emailMasthead}>
                                                    <a style={emailMastheadName} href="http://www.birdervsbirder.com/">Birder Vs Birder</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={emailBody} width="100%">
                                                    <table style={emailBodyInner} align="center" width="570" cellPadding="0" cellSpacing="0">
                                                        <tbody>
                                                            <tr><td>{props.children}</td></tr>
                                                        </tbody>
                                                    </table>
                                                    <table style={donateStyle} align="center" width="570" cellPadding="0" cellSpacing="0">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <p>
                                                                        Thank you for being a member of the Birder Vs Birder community.
                                                                        Please help Birder Vs Birder stay up and running.
                                                                        Your donations go towards the costs of running our servers and building new features.
                                                                    </p>
                                                                    <a style={donateButton} href="http://www.birdervsbirder.com/donate">Donate</a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <table style={emailFooter} align="center" width="570" cellPadding="0" cellSpacing="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style={contentCell}>
                                                                    <p style={emailFooterP}>© 2016 Birder Vs Birder. All rights reserved.</p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
    );
};

module.exports = Layout;
