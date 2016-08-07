var React = require('react');
var NameSearch = require('./NameSearch');
var ButtonList = require('./ButtonList');

var NameList = React.createClass({
    onNameAdded(obj) {
        let set = new Set(this.props.list);
        set.add(obj.value);
        this.props.onChange(set);
    },

    render() {
        return (
            <div>
                <NameSearch onChange={this.onNameAdded} />
                <ButtonList style={{ marginTop: 30 }} list={this.props.list} onChange={this.props.onChange} />
            </div>
        );
    },
});

module.exports = NameList;