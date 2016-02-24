var React = require('react');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');
var { ListGroup, ListGroupItem, Panel } = require('react-bootstrap');
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
            options: [],
        };
    },

    componentWillMount() {
        this.subRef = firebaseRef.child('ebird/subscriptions').child(this.context.authData.uid);
        this.bindAsObject(this.subRef, 'subscriptions');

        this.getOptions();
    },

    getOptions() {
        var locationsRef = firebaseRef.child('ebird/locations');
        locationsRef.once('value').then(snap => {
            var locs = snap.val();
            var options = [];
            for (var code in locs) {
                var loc = locs[code];
                options.push({
                    value: code,
                    label: `${loc.name} - (${code})`,
                });
            }
            this.setState({
                options,
            });
        });
    },

    renderSubscriptions() {
        if (!this.state.subscriptions) {
            return;
        }
        var subs = [];
        var subscriptions = this.state.subscriptions;
        for (var key in subscriptions) {
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
        return (
            <Select
                style={{
                    marginBottom: 20,
                }}
                placeholder="Add a Challenge Region"
                options={this.state.options}
                onChange={this.addSubscription}
            />
        );
    },

    render() {
        return (
            <Panel style={{
                width: 400,
            }}>
                <h3>Your Challenges</h3>
                {this.renderTypeahead()}
                {this.renderSubscriptions()}
            </Panel>
        );
    },
});

module.exports = SubscriptionList;