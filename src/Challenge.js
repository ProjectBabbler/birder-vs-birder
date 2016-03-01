var React = require('react');
var HomePanel = require('./HomePanel');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');
var { Label }= require('react-bootstrap');

var Challenge = React.createClass({
    mixins: [ReactFireMixin],

    contextTypes: {
        authData: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            challenge: null,
            members: [],
        };
    },

    componentWillMount() {
        var challenge = this.props.challenge;
    },

    componentWillMount() {
        this.challengesRef = firebaseRef.child('challenges').child(this.props.id);
        this.bindAsObject(this.challengesRef, 'challenge');

        this.challengesRef.child('members').on('value', snap => {
            var ps = [];
            snap.forEach(member => {
                ps.push(firebaseRef.child('users').child(member.key()).once('value'));
            });

            Promise.all(ps).then(results => {
                var members = results.map(r => {
                    return r.val();
                });

                this.setState({
                    members,
                });
            });
        });
    },

    componentWillUnmount() {
        this.challengesRef.child('members').off('value');
    },

    render() {
        if (!this.state.challenge) {
            return <div/>;
        }

        var badgeStyle = {
            marginRight: 10,
        };

        var labels = [];
        if (this.context.authData.uid == this.state.challenge.owner) {
            labels.push(<Label bsStyle="primary" key="owner" style={badgeStyle}>Owner</Label>);
        }
        labels.push(<Label bsStyle="info" key="time" style={badgeStyle}>{this.state.challenge.time}</Label>);
        labels.push(<Label bsStyle="info" key="code" style={badgeStyle}>{this.state.challenge.code}</Label>);

        return (
            <HomePanel>
                {labels}
                <h3>{this.state.challenge.name}</h3>
                {this.state.members.map(m => m.ebird_username)}
            </HomePanel>
        );
    },
});

module.exports = Challenge;