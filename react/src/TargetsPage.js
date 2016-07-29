var React = require('react');
import { browserHistory } from 'react-router';
var LocationsSearch;
if (process.env.BROWSER) {
    LocationsSearch = require('bird-locations/lib/search');
} else {
    LocationsSearch = React.DOM.div;
}
var birdLocations = require('bird-locations');


var TargetsPage = React.createClass({
    getInitialState() {
        return {
            location: null,
        };
    },

    updateLocation(location) {
        if (!location) {
            return;
        }

        browserHistory.push({
            ...this.props.location,
            query: {
                ...this.props.location.query,
                location: location.value,
            }
        });

        this.setState({
            location,
        });
    },

    componentDidMount() {
        birdLocations.getByCode(this.props.location.query.location).then(loc => {
            this.setState({
                location: {
                    value: this.props.location.query.location,
                    label: birdLocations.getNiceName(loc),
                    location: loc,
                },
            });
        });
    },

    render() {
        return (
            <div>
                <h4>Show species observed in</h4>
                <LocationsSearch value={this.state.location} onChange={this.updateLocation} />

            </div>
        );
    },
});

module.exports = TargetsPage;