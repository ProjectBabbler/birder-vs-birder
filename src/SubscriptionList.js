var React = require('react');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');
var { ListGroup, ListGroupItem } = require('react-bootstrap');
var Select = require('react-select');
require('react-select/dist/react-select.min.css')



var SubscriptionList = React.createClass({
    mixins: [ReactFireMixin],
    contextTypes: {
        authData: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            subscriptions: null,
        };
    },

    componentWillMount() {
        this.subRef = firebaseRef.child('ebird/subscriptions').child(this.context.authData.uid);
        this.bindAsObject(this.subRef, 'subscriptions');
    },

    renderSubscriptions() {
        if (!this.state.subscriptions) {
            return;
        }
        var subs = [];
        var subscriptions = this.state.subscriptions;
        for (var key in subscriptions) {
            console.log(key)
            if (key != '.key' && key != '.value') {
                var name = subscriptions[key];
                subs.push({
                    name: name,
                    code: key,
                });
            }
        }

        return (
            <ListGroup>
                {subs.map(sub => {
                    return (
                        <ListGroupItem key={sub.code}>{sub.name}</ListGroupItem>
                    )
                })}
            </ListGroup>
        );
    },

    addSubscription(obj) {
        this.subRef.child(obj.value).set(obj.label);
    },

    renderTypeahead() {
        var options = [
            { value: 'US', label: 'United States of America' },
            { value: 'CA', label: 'Canada' }
        ];


        return (
            <Select
                options={options}
                onChange={this.addSubscription}
            />
        );
    },

    render() {
        return (
            <div>
                {this.renderTypeahead()}
                {this.renderSubscriptions()}
            </div>
        );
    },
});

module.exports = SubscriptionList;