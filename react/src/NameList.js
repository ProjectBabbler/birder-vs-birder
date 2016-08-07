var React = require('react');
var NameSearch = require('./NameSearch');
var ButtonList = require('./ButtonList');
var { Button } = require('react-bootstrap');

var NameList = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
    },

    onNameAdded(obj) {
        let set = new Set(this.props.list);
        set.add(obj.value);
        this.props.onChange(set);
    },

    addMe() {
        this.onNameAdded({
            value: this.context.authData.uid,
        });
    },

    render() {
        return (
            <div>
                <NameSearch onChange={this.onNameAdded} />
                <ButtonList style={{ marginTop: 30 }} list={this.props.list} onChange={this.props.onChange} />
                {this.context.authData && !this.props.list.has(this.context.authData.uid) ? (
                    <Button style={{ marginTop: 30 }} onClick={this.addMe}>
                        Add me to this list
                    </Button>
                ) : null}
            </div>
        );
    },
});

module.exports = NameList;