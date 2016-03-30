var React = require('react');
var { Button } = require('react-bootstrap');
import { browserHistory } from 'react-router';


var Donate = React.createClass({
    getDefaultProps() {
        return {
            size: 'xsmall',
        };
    },

    goToDonate() {
        browserHistory.push({
            pathname: '/donate',
        });
    },

    render() {
        return (
            <Button bsSize={this.props.size} onClick={this.goToDonate}>
                Donate
            </Button>
        );
    }
});

module.exports = Donate;