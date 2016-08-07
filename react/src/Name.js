var React = require('react');
var firebaseApp = require('../firebase');

var Name = React.createClass({
    getInitialState() {
        return {
            name: '?',
        };
    },

    componentWillMount() {
        this.getName(this.props.uid);
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.uid != nextProps.uid) {
            this.getName(nextProps.uid);
        }
    },

    getName(uid) {
        firebaseApp.database().ref('users').child(uid).once('value').then(snap => {
            var data = snap.val() || {};
            this.setState({
                name: data.fullname || data.ebird_username || data.email || '?',
            });
        });
    },

    render() {
        return (
            <span>
                {this.state.name}
            </span>
        );
    },
});

module.exports = Name;