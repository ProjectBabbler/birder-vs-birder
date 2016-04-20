var React = require('react');

var Ad = React.createClass({
    componentDidMount() {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    },

    render() {
        return (
            <ins
                className="adsbygoogle"
                style={{display: 'block'}}
                data-ad-client="ca-pub-7018855494250858"
                data-ad-slot={this.props.slot}
                data-ad-format="auto"
            />
        );
    },
});

module.exports = Ad;