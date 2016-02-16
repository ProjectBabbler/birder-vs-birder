var React = require('react');
var { Panel, Input, ButtonInput } = require('react-bootstrap');

var SignIn = React.createClass({
    render() {
        return (
            <Panel header="Birder Vs Birder Sign In">
                <form action="/rest/gumroad/store" method="post">
                    <Input name="name" type="text" label="Username" placeholder="Enter Ebird Username" />
                    <Input name="password" type="text" label="Password" placeholder="Enter Ebird Password" />
                    <ButtonInput type="submit" bsStyle="primary" value="Sign In" />
                </form>
            </Panel>
        );
    },
});

module.exports = SignIn;