var React = require('react');
var ChallengeListener = require('./ChallengeListener');
var LoadingOverlay = require('./LoadingOverlay');
var axios = require('axios');
var Challenge = require('./Challenge');
var ReactDataGrid = require('react-data-grid');
if (process.env.BROWSER) {
    require('react-data-grid/themes/react-data-grid.css');
}
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
        var species = {};
        lists.forEach(({list, user}) => {
            list.forEach(s => {
                var sp = species[s.speciesCode] || {};
                sp.bird = s;
                sp[user.data.ebird_username] = s;
                species[s.speciesCode] = sp;
            });
        });

        this.setState({
            bySpecies: Object.values(species),
        });
    },

    renderTable() {
        if (!this.state.lists || !this.state.bySpecies) {
            return;
        }
        var bySpecies = this.state.bySpecies;

        var userColumns = this.state.lists.map(list => {
            return {
                name: list.user.data.fullname,
                key: list.user.data.ebird_username,
                formatter: React.createClass({
                    render() {
                        if (this.props.value != null) {
                            return (
                                <div style={{textAlign: 'center'}}>x</div>
                            );
                        }

                        return <div/>;
                    }
                }),
            };
        });

        var rows = bySpecies.sort((a, b) => {
            return a.bird.taxonOrder - b.bird.taxonOrder;
        });

        var columns = [
            {
                key: 'bird',
                name: 'Bird Name',
                locked: true,
                formatter: React.createClass({
                    render() {
                        return <span>{this.props.value.comName}</span>;
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
