var React = require('react');

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
                <div style={{
                    textAlign: 'center',
                    background: '#18bc9c',
                    color: 'white',
                }}>
                    <div style={{
                        padding: 100,
                    }}>
                        <h1>Logo</h1>
                        <h1 style={styles.main}>Birder Vs Birder</h1>
                        {this.renderLine()}
                        <h1>It's not just for the birds</h1>
                    </div>
                </div>
            </div>
        );
    },
});

module.exports = WelcomePage;