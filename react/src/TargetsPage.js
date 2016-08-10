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
var { DropdownButton, MenuItem, Table } = require('react-bootstrap');
var LoadingOverlay = require('./LoadingOverlay');
var NameList = require('./NameList');
import CircularProgress from 'material-ui/CircularProgress';
let axios = require('axios');

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
            fetching: true,
            targets: [],
            users: [],
        };
    },

    sortResults(usersData) {
        let species = {};
        usersData.forEach(userData => {
            let {user, targets} = userData;
            targets.forEach(target => {
                let obj = species[target.species.code] || {};
                let users = obj.users || [];
                species[target.species.code] = {
                    users: [...users, user.uid],
                    ...target,
                };
            });
        });

        let sorted = Object.values(species).sort((a, b) => {
            return b.frequency - a.frequency;
        });

        return sorted;
    },

    getTargets(props=this.props) {
        this.setState({
            fetching: true,
        });

        axios.post('/api/targets', {
            startMonth: 1,
            endMonth: 1,
            time: 'life',
            area: 'world',
            ...props.location.query,
        }).then((results) => {
            let list = this.sortResults(results.data);
            let users = results.data.map(userData => {
                return userData.user;
            });
            this.setState({
                targets: list,
                users,
            });
        }).catch((err) => {
            console.log(err);
        }).then(() => {
            this.setState({
                fetching: false,
            });
        });
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
                area: 'world',
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

        this.getTargets();
    },

    componentWillReceiveProps(nextProps) {
        let compare = false;
        for (let key in nextProps.location.query) {
            compare = compare || nextProps.location.query[key] != this.props.location.query[key];
        }
        if (compare) {
            this.getTargets(nextProps);
        }
    },

    renderTargets() {
        return (
            <div>
                <Table striped={true} bordered={true} hover={true}>
                    <thead>
                        <tr>
                            <th>
                                Species
                            </th>
                            <th>
                                Frequency
                            </th>
                            <th>
                                Map
                            </th>
                            {this.state.users.map((user, i) => {
                                return (
                                    <th key={i}>
                                        {user.fullname}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.targets.map((target, i) => {
                            return (
                                <tr key={i}>
                                    <td>
                                        {target.species.name}
                                    </td>
                                    <td>
                                        {target.frequency}
                                    </td>
                                    <td>
                                        <a target="_blank" href={target.map}>Map</a>
                                    </td>
                                    {this.state.users.map((user, i) => {
                                        return (
                                            <td key={i} style={{textAlign: 'center'}}>
                                                {target.users.indexOf(user.uid) != -1 ? 'x' : ''}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        );
    },

    getAreas() {
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

        return areas;
    },

    render() {
        if (!this.state.allLocations) {
            return <LoadingOverlay isOpened={true} />;
        }

        let areas = this.getAreas();

        let area = areas[areas.length - 1];
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
                <h4>Targets</h4>
                <div>
                    {this.state.fetching ? (
                        <CircularProgress />
                    ) : this.renderTargets()}
                </div>
            </div>
        );
    },
});

module.exports = TargetsPage;