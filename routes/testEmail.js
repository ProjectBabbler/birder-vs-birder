var postmark = require('postmark');
var Keys = require('../src/Keys');
var client = new postmark.Client(Keys.postmark);
var TestEmail = require('../bin/email/TestEmail');
var ReactDOMServer = require('react-dom/server');
var React = require('react');

client.sendEmail({
    From: 'info@birdervsbirder.com',
    To: process.env.TEST_EMAIL,
    Subject: 'Test Birder Vs Birder Email',
    HtmlBody: ReactDOMServer.renderToStaticMarkup(React.createElement(TestEmail)),
}, (error, success) => {
    if (error) {
        console.error('Unable to send via postmark: ' + error.message);
    } else {
        console.info('Sent to postmark for delivery');
    }
});