var React = require('react');
import { browserHistory } from 'react-router';
var LocationsSearch;
if (process.env.BROWSER) {
    LocationsSearch = require('bird-locations/lib/search');
} else {
    LocationsSearch = React.DOM.div;
}
var birdLocations = require('bird-locations');
var MonthSelector = require('./MonthSelector');
var { DropdownButton, MenuItem } = require('react-bootstrap');
var LoadingOverlay = require('./LoadingOverlay');
var NameList = require('./NameList');

var TargetsPage = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
    },

    getInitialState() {
        return {
            location: {
                value: 'aba',
            },
            allLocations: null,
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

    updateStartMonth(startMonth) {
        this.update({
            startMonth,
        });
    },

    updateEndMonth(endMonth) {
        this.update({
            endMonth,
        });
    },

    updateArea(area) {
        this.update({
            area,
        });
    },

    updateTime(time) {
        this.update({
            time,
        });
    },

    updateUsers(users) {
        this.update({
            users: Array.from(users).join(','),
        });
    },

    update(query) {
        browserHistory.push({
            ...this.props.location,
            query: {
                ...this.props.location.query,
                ...query,
            }
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

        birdLocations.getAll().then(locations => {
            this.setState({
                allLocations: locations,
            });
        });

        let users = this.props.location.query.users;
        if (!users && this.context.authData) {
            this.updateUsers([this.context.authData.uid]);
        }
    },

    render() {
        if (!this.state.allLocations) {
            return <LoadingOverlay isOpened={true} />;
        }

        let areas = [
            {
                value: 'aba',
                label: 'ABA Area',
            },
            {
                value: 'world',
                label: 'World',
            },
        ];

        let parts = this.props.location.query.location.split('-');
        for (let i = 0; i < parts.length; i++) {
            let code = parts.slice(0, i + 1).join('-');
            let location = this.state.allLocations[code];
            areas.unshift({
                value: code,
                label: birdLocations.getNiceName(location),
            });
        }

        let area = areas[0];
        if (this.props.location.query.area) {
            area = areas.find((a) => {
                return a.value == this.props.location.query.area;
            });
        }

        let time = this.props.location.query.time || 'life';
        let times = [
            'life',
            'year',
            'month',
            'day',
        ];

        let users = this.props.location.query.users || '';
        let userSet = new Set();
        if (users) {
            userSet = new Set(users.split(','));
        }

        return (
            <div>
                <h4>Show species observed in</h4>
                <LocationsSearch value={this.state.location} onChange={this.updateLocation} />
                <h4>During the months of:</h4>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <MonthSelector value={this.props.location.query.startMonth} onChange={this.updateStartMonth} />
                    <span style={{margin: 15}}>through</span>
                    <MonthSelector value={this.props.location.query.endMonth} onChange={this.updateEndMonth} />
                </div>
                <h4>That I need for my:</h4>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <DropdownButton title={area.label} id={Math.random()}>
                        {areas.map((a, i) => {
                            return (
                                <MenuItem key={i} eventKey={a.value} onSelect={this.updateArea}>{a.label}</MenuItem>
                            );
                        })}
                    </DropdownButton>
                    <DropdownButton title={time} id={Math.random()} style={{margin: 15}}>
                        {times.map((t, i) => {
                            return (
                                <MenuItem key={i} eventKey={t} onSelect={this.updateTime}>{t}</MenuItem>
                            );
                        })}
                    </DropdownButton>
                    <span>list</span>
                </div>
                <h4>Users:</h4>
                <NameList onChange={this.updateUsers} list={userSet} />
            </div>
        );
    },
});

module.exports = TargetsPage;