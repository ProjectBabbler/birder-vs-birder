var React = require('react');
var ReactHighcharts = require('react-highcharts');


var BirdListGraph = React.createClass({
    getInitialState() {
        return {
            chartKey: 0,
        };
    },

    componentWillReceiveProps(nextProps) {
        this.setState({
            chartKey: this.state.chartKey + 1,
        });
    },

    render() {
        if (!this.props.lists) {
            return <div/>;
        }

        var series = this.props.lists.map(list => {
            var buckets = new Map();
            list.list.forEach(s => {
                var total = 0;
                if (buckets.has(s.date)) {
                    total = buckets.get(s.date);
                }

                buckets.set(s.date, total + 1);
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
                name: `${list.user.data.fullname} - (${total})`,
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
                text: this.props.title,
            },
            subtitle: {
                text: this.props.subtitle
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

        return (
            <div style={{
                flexGrow: 1,
                marginLeft: 10,
            }}>
                <ReactHighcharts config={config} key={this.state.chartKey} />
            </div>
        );
    },
});

module.exports = BirdListGraph;
