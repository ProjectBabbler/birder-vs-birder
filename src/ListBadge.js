var React = require('react');

var ListBadge = React.createClass({
    render() {
        return (
            <div style={{
                ...this.props.style,
                width: 250,
                height: 325,
                backgroundImage: 'url("http://www.birdervsbirder.com/static/images/parrot.jpg")',
                backgroundSize: 'contain',
                borderRadius: 200,
                border: '5px solid goldenrod',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    fontSize: '60px',
                    color: 'gold',
                    fontStyle: 'bold',
                    textAlign: 'center',
                    textShadow: '2px 2px #FF0000',
                }}>
                    {this.props.list}
                    <br/>
                    {this.props.total}
                </div>
            </div>
        );
    },
});

module.exports = ListBadge;