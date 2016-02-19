var React = require('react');
var { Nav, NavItem, Table } = require('react-bootstrap');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');
var axios = require('axios');
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
            tab: 'region',
            totals: null,
        };
    },

    handleSelect(selectedKey) {
        this.setState({
            tab: selectedKey,
        });
    },

    componentWillMount() {
        // TODO: Remove Scraping Call.
        axios.post('/api/ebirdScrape', {
            userId: this.context.authData.uid,
        }).then((result) => {
        }).catch((err) => {
            console.log(err);
        });

        this.bindAsObject(firebaseRef.child('ebird/totals').child(this.context.authData.uid), 'totals');
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

        var content = this.state.totals[this.state.tab];
        var rows = [];
        for (var code in content) {
            var row = content[code];
            rows.push(
                <tr key={code}>
                    <th>{row.name}</th>
                    <th>{row.life}</th>
                    <th>{row.year}</th>
                    <th>{row.month}</th>
                </tr>
            )
        }
        return (
            <Table striped bordered condensed hover>
                <thead>
                    <tr>
                        <th/>
                        <th>Life</th>
                        <th>Year</th>
                        <th>Month</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        )
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