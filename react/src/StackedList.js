var React = require('react');

var StackedList = React.createClass({
    render() {
        var items = this.props.items;
        var sorted = items.sort((a, b) => {
            return b.value - a.value;
        });

        var max;
        if (sorted.length) {
            max = sorted[0].value;
        }

        return (
            <div style={{
                backgroundColor: '#2c3e50',
                padding: 20,
                borderRadius: 5,
                color: 'white',
            }}>
                {sorted.map((m, i) => {
                    var value = m.value || 0;
                    return (
                        <div key={i} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                position: 'relative',
                                width: '100%',
                            }}>
                                <div
                                    className="bg-success"
                                    style={{
                                        width: `${(value / max) * 100}%`,
                                        height: 40,
                                        marginBottom: 3,
                                        borderRadius: 3,
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    left: 10,
                                    top: 10,
                                }}>
                                    {m.label}
                                </div>
                            </div>
                            <div style={{
                                width: 50,
                                textAlign: 'right',
                            }}>
                                {value}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    },
});

module.exports = StackedList;