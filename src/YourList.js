var React = require('react');
var { Nav, NavItem, Table, Glyphicon } = require('react-bootstrap');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');
var CircularProgress = require('material-ui/lib/circular-progress');

var TABS = {
    region: 'Major Regions',
    country: 'Countries',
    state: 'States/Provences',
    county: 'Counties',
};

var YourLists = React.createClass({
    mixins: [ReactFireMixin],
    contextTypes: {
        authData: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            accending: false,
            sort: 'life',
            tab: 'region',
            totals: null,
        };
    },

    setSort(sort) {
        if (sort == this.state.sort) {
            this.setState({
                accending: !this.state.accending,
            });
        } else {
            this.setState({
                accending: false,
                sort: sort,
            });
        }
    },

    handleSelect(selectedKey) {
        this.setState({
            tab: selectedKey,
        });
    },

    componentWillMount() {
        this.bindAsObject(firebaseRef.child('ebird/totals').child(this.context.authData.uid), 'totals');
    },

    getTableHeader(label, key) {
        var downColor = 'lightgray';
        var upColor = 'lightgray';
        if (key == this.state.sort) {
            if (this.state.accending) {
                downColor = 'black';
            } else {
                upColor = 'black';
            }
        }

        var icon = (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Glyphicon style={{color: upColor}} glyph="menu-up" />
                <Glyphicon style={{color: downColor}} glyph="menu-down" />
            </div>
        );

        return (
            <th onClick={this.setSort.bind(this, key)}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                }}>
                    {label}
                    {icon}
                </div>
            </th>
        );
    },

    renderTable() {
        if (this.state.totals == null) {
            return (
                <div style={{
                    marginTop: 100,
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <CircularProgress size={2} />
                </div>
            );
        }

        var rows = [];
        for (var code in this.state.totals) {
            var row = this.state.totals[code];
            if (row && row.type == this.state.tab) {
                rows.push({
                    code: code,
                    ...row,
                });
            }
        }

        rows = rows.sort((a, b) => {
            if (this.state.accending) {
                return a[this.state.sort] - b[this.state.sort];
            } else {
                return b[this.state.sort] - a[this.state.sort];
            }
        });

        var hasMonth = this.state.tab != 'state';

        return (
            <Table striped={true} bordered={true} hover={true}>
                <thead>
                    <tr>
                        <th />
                        {this.getTableHeader('Life', 'life')}
                        {this.getTableHeader('Year', 'year')}
                        {hasMonth ? this.getTableHeader('Month', 'month') : null}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => {
                        return (
                            <tr key={row.code}>
                                <th>{row.name}</th>
                                <th>{row.life}</th>
                                <th>{row.year}</th>
                                {hasMonth ? (
                                    <th>{row.month}</th>
                                ) : null}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    },

    render() {
        var tabs = [];
        for (var key in TABS) {
            tabs.push(
                <NavItem eventKey={key} key={key}>{TABS[key]}</NavItem>
            );
        }

        return (
            <div>
                <h1>Your List</h1>
                <Nav bsStyle="tabs" activeKey={this.state.tab} onSelect={this.handleSelect}>
                    {tabs}
                </Nav>
                {this.renderTable()}
            </div>
        );
    },
});

module.exports = YourLists;