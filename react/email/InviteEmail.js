var Layout = require('./Layout');
var React = require('react');

var InviteEmail = (props) => {
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

    var acceptLink = `http://www.birdervsbirder.com/accept?email=${props.email}&challengeId=${props.challengeId}`;

    var name = props.inviter.fullname || 'A Friend';

    return (
        <Layout>
            <h3>{name} has invited you to a Birder Vs Birder challenge</h3>
            <h4>{props.challenge.name}</h4>
            <h5>{props.challenge.time} list for {props.challenge.code}</h5>
            <table style={body} align="center" width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                    <tr>
                        <td align="center">
                            <div>
                                <a style={button} href={acceptLink}>Accept Challenge</a>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Layout>
    );
};

module.exports = InviteEmail;