var postmark = require('postmark');
var Keys = require('../utils/Keys');
var client = new postmark.Client(Keys.postmark);
var TestEmail = require('../bin/react/email/TestEmail');
var ReactDOMServer = require('react-dom/server');
var React = require('react');
var chalk = require('chalk');

client.sendEmail({
    From: 'info@birdervsbirder.com',
    To: process.env.TEST_EMAIL,
    Subject: 'Test Birder Vs Birder Email',
    HtmlBody: ReactDOMServer.renderToStaticMarkup(React.createElement(TestEmail)),
}, (error, success) => {
    if (error) {
        console.error(chalk.red('Error'), 'Unable to send via postmark: ' + error.message);
    } else {
        console.info('Sent to postmark for delivery');
    }
});