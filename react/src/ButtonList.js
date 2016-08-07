var React = require('react');
var { Button, ButtonGroup } = require('react-bootstrap');

var ButtonList = React.createClass({
    removeItem(item) {
        var set = new Set(this.props.list);
        set.delete(item);
        this.props.onChange(set);
    },

    renderItem(item) {
        return (
            <ButtonGroup key={item} bsSize="small" style={{
                marginRight: 5,
            }}>
                <Button>{item}</Button>
                <Button onClick={this.removeItem.bind(this, item)}>X</Button>
            </ButtonGroup>
        );
    },

    render() {
        return (
            <div style={this.props.style}>
                {Array.from(this.props.list).map(this.renderItem)}
            </div>
        );
    },
});

module.exports = ButtonList;