var React = require('react');

var { Panel } = require('react-bootstrap');


var HomePanel = React.createClass({
    render() {
        return (
            <Panel style={{
                width: 400,
                marginRight: 20,
            }}>
                {this.props.children}
            </Panel>
        );
    },
});

module.exports = HomePanel;