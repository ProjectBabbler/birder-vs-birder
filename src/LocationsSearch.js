var React = require('react');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var Select = require('react-select');
require('react-select/dist/react-select.min.css');



var LocationsSearch = React.createClass({
    getInitialState() {
        return {
            options: [],
        };
    },

    componentWillMount() {
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

    render() {
        return (
            <Select.Async
                {...this.props}
                loadOptions={this.loadOptions}
            />
        );
    },
});

module.exports = LocationsSearch;