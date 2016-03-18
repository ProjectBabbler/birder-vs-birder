var React = require('react');
var ChallengeListener = require('./ChallengeListener');
var LoadingOverlay = require('./LoadingOverlay');
var axios = require('axios');
var ReactHighcharts = require('react-highcharts');

var ChallengePage = React.createClass({
    getInitialState() {
        return {
            loading: false,
            lists: null,
            chartKey: 0,
        };
    },

    componentWillMount() {
        if (this.props.challenge) {
            this.getMembersData();
        }
    },

    componentWillReceiveProps(nextProps) {
        this.setState({
            chartKey: this.state.chartKey + 1,
        });

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
        }).catch((err) => {
            console.log(err);
        }).then(() => {
            this.setState({
                loading: false,
            });
        });
    },

    renderGraph() {
        if (!this.state.lists) {
            return;
        }

        var series = this.state.lists.map(list => {
            var buckets = new Map();
            list.list.forEach(s => {
                var total = 0;
                if (buckets.has(s.Date)) {
                    total = buckets.get(s.Date);
                }

                buckets.set(s.Date, total + 1);
            });

            var data = Array.from(buckets).map(b => {
                return {
                    date: Date.parse(`${b[0]} GMT`),
                    value: b[1],
                };
            });

            var sorted = data.sort((a, b) => {
                return a.date - b.date;
            });

            var total = 0;
            sorted = sorted.map(s => {
                total += s.value;
                return {
                    ...s,
                    value: total,
                };
            });

            return {
                name: `${list.user.data.ebird_username} - (${total})`,
                data: sorted.map(d => {
                    return [d.date, d.value];
                }),
            };
        });

        var config = {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: this.props.challenge.name,
            },
            subtitle: {
                text: `${this.props.challenge.time} list for ${this.props.challenge.code}`
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Number of Species'
                },
            },
            series: series,
        };

        return <ReactHighcharts config={config} key={this.state.chartKey} />;
    },

    render() {
        return (
            <div>
                <LoadingOverlay isOpened={this.state.loading} />
                {this.renderGraph()}
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