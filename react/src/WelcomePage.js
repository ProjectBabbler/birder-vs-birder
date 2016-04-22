var React = require('react');
var StackedList = require('./StackedList');
var { Image, Button } = require('react-bootstrap');
var { Link } = require('react-router');

var WelcomePage = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
    },

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
            },

            logo: {
                width: 300,
            },
        };

        return (
            <div>
                <div className="bg-success" style={{
                    textAlign: 'center',
                    color: 'white',
                    padding: 100,
                }}>
                    <img className="test-logo" style={styles.logo} src="/static/images/logo.svg" />
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
                <div className="bg-success" style={{
                    textAlign: 'center',
                    color: 'white',
                    padding: 100,
                }}>
                    <h2 style={styles.main}>About</h2>
                    {this.renderLine()}
                    <p style={{
                        fontSize: 30,
                        textAlign: 'center',
                    }}>
                        Birder vs Birder is brought to you by Project Babbler,<br/>
                        an organization built upon leveraging technology to enchance nature experiences
                    </p>
                </div>
                {!this.context.authData ? (
                    <div style={{
                        padding: 100
                    }}>
                        <div style={{
                            textAlign: 'center',
                        }}>
                            <h1 style={styles.main}><Link to={{pathname: '/signup'}}>Sign Up Now</Link>  Its free</h1>
                            {this.renderLine()}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    },
});

module.exports = WelcomePage;
