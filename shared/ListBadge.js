var React = require('react');

var ListBadge = (props) => {
    return (
        <div style={{
            ...props.style,
            width: 250,
            height: 325,
            backgroundImage: 'url("http://www.birdervsbirder.com/static/images/parrot.jpg")',
            backgroundSize: 'contain',
            borderRadius: 200,
            border: '5px solid goldenrod',
        }}>
            <div style={{
                marginTop: 75,
                fontSize: '60px',
                color: 'gold',
                fontStyle: 'bold',
                textAlign: 'center',
                textShadow: '2px 2px #FF0000',
            }}>
                {props.list}
                <br/>
                {props.total}
            </div>
        </div>
    );
};

module.exports = ListBadge;