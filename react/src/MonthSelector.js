var React = require('react');
var { DropdownButton, MenuItem } = require('react-bootstrap');

var MonthSelector = React.createClass({
    getDefaultProps() {
        return {
            value: 0,
        };
    },

    onSelect(month) {
        this.props.onChange(month);
    },

    render() {
        let months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
        return (
            <DropdownButton title={months[this.props.value]} key={this.props.value} id={Math.random()}>
                {months.map((month, i) => {
                    return (
                        <MenuItem key={i} eventKey={i} onSelect={this.onSelect}>{month}</MenuItem>
                    );
                })}
            </DropdownButton>
        );
    },
});

module.exports = MonthSelector;