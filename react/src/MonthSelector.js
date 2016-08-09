var React = require('react');
var { DropdownButton, MenuItem } = require('react-bootstrap');

var MonthSelector = React.createClass({
    getDefaultProps() {
        return {
            value: 1,
        };
    },

    onSelect(month) {
        this.props.onChange(month + 1);
    },

    render() {
        let months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
        // Ebird set's Jan as 1.
        return (
            <DropdownButton title={months[this.props.value - 1]} key={this.props.value} id={Math.random()}>
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