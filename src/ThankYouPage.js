var React = require('react');
var { Link } = require('react-router');

var ThankYouPage = React.createClass({
    render() {
        return (
            <div>
                <h3>Thank you for donating to Birder Vs Birder.  We couldn't do this without your support</h3>
                <Link to={{pathname: '/'}}>Back to home page</Link>
            </div>
        );
    },
});

module.exports = ThankYouPage;