var React = require('react');
var StackedList = require('./StackedList');

var WelcomePage = React.createClass({
    renderLine() {
        return (
            <div
                style={{
                    padding: 0,
                    borderTop: 'solid 5px',
                    textAlign: 'center',
                    maxWidth: 250,
                    margin: '25px auto 30px',
                }}
            />
        );
    },

    render() {
        var styles = {
            main: {
                display: 'block',
                fontFamily: '"Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif',
                textTransform: 'uppercase',
                fontWeight: 700,
                fontSize: '4em',
            }
        };

        return (
            <div>
                <div className="bg-success" style={{
                    textAlign: 'center',
                    color: 'white',
                    padding: 100,
                }}>
                    <h1>Logo</h1>
                    <h1 style={styles.main}>Birder Vs Birder</h1>
                    {this.renderLine()}
                    <h1>It's not just for the birds</h1>
                </div>
                <div style={{
                    padding: 100
                }}>
                    <div style={{
                        textAlign: 'center',
                    }}>
                        <h1 style={styles.main}>Track and Compete</h1>
                        {this.renderLine()}
                    </div>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                    }}>
                        <ul style={{
                            flexGrow: 1,
                            fontSize: '2em',
                            marginRight: 20,
                        }}>
                            <li>Track you life and year lists</li>
                            <li>Compete with your friends</li>
                            <li>Visualize your birding history</li>
                        </ul>
                        <div style={{
                            width: 500,
                        }}>
                            <StackedList
                                items={[
                                    {
                                        label: 'Greg',
                                        value: 357,
                                    },
                                    {
                                        label: 'Steph',
                                        value: 301,
                                    },
                                    {
                                        label: 'Alex',
                                        value: 235,
                                    },
                                    {
                                        label: 'Jessica',
                                        value: 181,
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});

module.exports = WelcomePage;