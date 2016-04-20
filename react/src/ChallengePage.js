var React = require('react');
var ChallengeListener = require('./ChallengeListener');
var LoadingOverlay = require('./LoadingOverlay');
var axios = require('axios');
var Challenge = require('./Challenge');
var ReactDataGrid = require('react-data-grid');
if (process.env.BROWSER) {
    require('react-data-grid/themes/react-data-grid.css');
}
var birdList = require('bird-list');
var BirdListGraph = require('./BirdListGraph');


var ChallengePage = React.createClass({
    getInitialState() {
        return {
            loading: false,
            lists: null,
            speciesData: null,
        };
    },

    componentWillMount() {
        if (this.props.challenge) {
            this.getMembersData();
        }
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.challenge && nextProps.challenge != this.props.challenge) {
            this.getMembersData(nextProps);
        }
    },

    getMembersData(props=this.props) {
        this.setState({
            loading: true,
        });

        axios.post('/api/challengeLists', {
            challengeId: props.challengeId,
        }).then((results) => {
            this.setState({
                lists: results.data,
            });
            this.processTableData(results.data);
        }).catch((err) => {
            console.log(err);
        }).then(() => {
            this.setState({
                loading: false,
            });
        });
    },

    processTableData(lists) {
        var species = new Set();
        lists.forEach(list => {
            list.list.forEach(s => {
                species.add(s.speciesCode);
            });
        });

        var ps = [];
        species.forEach(s => {
            ps.push(birdList.getBySpeciesCode(s));
        });

        Promise.all(ps).then(results => {
            var hash = {};
            results.forEach(d => {
                hash[d.speciesCode] = d;
            });
            this.setState({
                speciesData: hash,
            });
        }).catch(e => {
            console.error(e);
        });
    },

    renderTable() {
        if (!this.state.lists || !this.state.speciesData) {
            return;
        }
        var speciesData = this.state.speciesData;

        var rows = new Map();
        var userColumns = this.state.lists.map(list => {
            list.list.forEach(s => {
                var key = s.speciesCode;
                var value = {};
                if (rows.has(key)) {
                    value = rows.get(key);
                }

                value[list.user.data.ebird_username] = true;

                rows.set(key, value);
            });

            return {
                name: list.user.data.fullname,
                key: list.user.data.ebird_username,
                formatter: React.createClass({
                    render() {
                        if (this.props.value == true) {
                            return (
                                <div style={{textAlign: 'center'}}>x</div>
                            );
                        }

                        return <div/>;
                    }
                }),
            };
        });

        rows = Array.from(rows);
        rows = rows.map(r => {
            return {
                bird: r[0],
                ...r[1],
            };
        });

        rows = rows.sort((a, b) => {
            return speciesData[a.bird].taxonOrder - speciesData[b.bird].taxonOrder;
        });

        var columns = [
            {
                key: 'bird',
                name: 'Bird Name',
                locked: true,
                formatter: React.createClass({
                    render() {
                        return <span>{speciesData[this.props.value].comName}</span>;
                    }
                }),
            },
            ...userColumns,
        ];

        var rowGetter = (i) => {
            return rows[i];
        };

        return (
            <div style={{
                marginTop: 50,
                marginBottom: 50,
            }}>
                <ReactDataGrid
                    columns={columns}
                    rowGetter={rowGetter}
                    rowsCount={rows.length}
                />
            </div>
         );
    },

    render() {
        return (
            <div>
                <LoadingOverlay isOpened={this.state.loading} />
                <div style={{
                    textAlign: 'right',
                    fontStyle: 'italic',
                }}>
                    Graphs updated every 4 hours
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <Challenge id={this.props.challengeId} />
                    {this.props.challenge ? (
                        <BirdListGraph
                            lists={this.state.lists}
                            title={this.props.challenge.name}
                            subtitle={`${this.props.challenge.time} list for ${this.props.challenge.code}`}
                        />
                    ) : null}
                </div>
                {this.renderTable()}
            </div>
        );
    },
});

var Wrapper = React.createClass({
    render() {
        return (
            <ChallengeListener id={this.props.location.query.id}>
                <ChallengePage {...this.props} />
            </ChallengeListener>
        );
    }
});

module.exports = Wrapper;