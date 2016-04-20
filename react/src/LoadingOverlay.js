var React = require('react');
import CircularProgress from 'material-ui/CircularProgress';

var LoadingOverlay = React.createClass({
    propTypes: {
        isOpened: React.PropTypes.bool,
    },

    render() {
        if (!this.props.isOpened) {
            return <div/>;
        }

        return (
            <div
                className="test-loading-overlay"
                style={{
                    zIndex: 10000,
                    backgroundColor: 'rgba(0, 0, 0, .5)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <CircularProgress />
            </div>
        );
    },
});

module.exports = LoadingOverlay;
