var React = require('react');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');
var { ListGroup, ListGroupItem } = require('react-bootstrap');
var Select = require('react-select');
require('react-select/dist/react-select.min.css');
var HomePanel = require('./HomePanel');



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

    loadOptions(input, callback) {
        var filtered = this.state.options.filter(o => {
            return o.label.toLowerCase().match(input);
        });
        var limited = filtered.slice(0, 10);

        callback(null, {
            options: limited
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
                var data = subscriptions[key];
                var time = data.time.charAt(0).toUpperCase() + data.time.slice(1);
                subs.push({
                    name: data.name,
                    time: time,
                    code: key,
                });
            }
        }

        return (
            <ListGroup>
                {subs.map(sub => {
                    return (
                        <ListGroupItem key={sub.code}>{sub.time} List for {sub.name}</ListGroupItem>
                    );
                })}
            </ListGroup>
        );
    },

    addSubscription(obj) {
        this.subRef.child(obj.value).set({
            name: obj.label,
            time: 'life',
        });
    },

    renderTypeahead() {
        return (
            <Select.Async
                style={{
                    marginBottom: 20,
                }}
                placeholder="Add a Challenge Region"
                loadOptions={this.loadOptions}
                onChange={this.addSubscription}
            />
        );
    },

    render() {
        return (
            <HomePanel>
                <h3>Your Challenges</h3>
                {this.renderTypeahead()}
                {this.renderSubscriptions()}
            </HomePanel>
        );
    },
});

module.exports = SubscriptionList;