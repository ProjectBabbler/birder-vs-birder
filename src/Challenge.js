var React = require('react');
var HomePanel = require('./HomePanel');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');
var { Label, DropdownButton, Glyphicon }= require('react-bootstrap');
var Confirm = require('react-confirm-bootstrap');
var Radium = require('radium');
var EditChallengeModal = require('./EditChallengeModal');
var StackedList = require('./StackedList');
var { Link } = require('react-router');
var UserUtils = require('../utils/UserUtils');
var AddFriendsModal = require('./AddFriendsModal');



var Challenge = Radium(React.createClass({
    mixins: [ReactFireMixin],

    contextTypes: {
        authData: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            members: [],
            deleting: false,
            editing: false,
            inviting: false,
        };
    },

    componentWillMount() {
        this.challengesRef = firebaseRef.child('challenges').child(this.props.id);
        this.challengesRef.child('members').on('value', snap => {
            var ps = [];
            snap.forEach(member => {
                ps.push(new Promise((resolve, reject) => {
                    Promise.all([
                        firebaseRef.child('users').child(member.key()).once('value'),
                        UserUtils.getRecentTotalsRef(member.key()).then(ref => {
                            return ref.child(this.props.challenge.code).once('value');
                        }),
                    ]).then(result => {
                        return {
                            user: result[0].val(),
                            userKey: result[0].key(),
                            total: result[1].val() || {},
                        };
                    }).then(resolve).catch(reject);
                }));
            });

            Promise.all(ps).then(results => {
                this.setState({
                    members: results,
                });
            });
        });
    },

    onDelete() {
        this.setState({
            deleting: true,
        });
        var ps = [];
        this.state.members.forEach(user => {
            ps.push(firebaseRef.child('users').child(user.userKey).child('challenges').child(this.props.id).set(null));
        });
        ps.push(this.challengesRef.set(null));

        Promise.all(ps).catch((e) => {
            console.log(e);
            this.setState({
                deleting: false,
            });
        });
    },

    componentWillUnmount() {
        this.challengesRef.child('members').off('value');
    },

    onEdit() {
        this.setState({
            editing: true,
        });
    },

    onInvite() {
        this.setState({
            inviting: true,
        });
    },

    renderSettings() {
        var menuStyle = {
            display: 'block',
            padding: '3px 20px',
            clear: 'both',
            fontWeight: '400',
            lineHeight: '1.42857143',
            color: '#333 !important',
            whiteSpace: 'nowrap',

            ':hover': {
                color: '#262626',
                textDecoration: 'none',
                backgroundColor: '#f5f5f5',
            },
        };

        return (
            <div>
                <DropdownButton title={<Glyphicon glyph="cog" />} id={`delete-${this.props.id}`} bsSize="xsmall">
                    <div onClick={this.onInvite} style={menuStyle} key="invite">Invite</div>
                    {this.isOwner() ? [
                        <div onClick={this.onEdit} style={menuStyle} key="edit">Edit</div>,
                        <Confirm
                            onConfirm={this.onDelete}
                            body="Are you sure you want to delete this challenge? It can't be undone"
                            confirmText="Confirm"
                            title={`Delete "${this.props.challenge.name}"`}>
                            <div style={menuStyle} key="delete">Delete</div>
                        </Confirm>
                    ] : null}
                </DropdownButton>
                {this.state.editing ? (
                    <EditChallengeModal
                        edit={true}
                        challenge={this.props.challenge}
                        challengeId={this.props.challengeId}
                        onClose={() => {
                            this.setState({ editing: false, });
                        }}
                    />
                ) : null}
                {this.state.inviting ? (
                    <AddFriendsModal
                        challengeId={this.props.challengeId}
                        onClose={() => {
                            this.setState({ inviting: false, });
                        }}
                    />
                ) : null}
            </div>
        );
    },

    isOwner() {
        return this.context.authData.uid == this.props.challenge.owner;
    },

    render() {
        var badgeStyle = {
            marginRight: 10,
        };

        var labels = [];
        if (this.isOwner()) {
            labels.push(<Label bsStyle="primary" key="owner" style={badgeStyle}>Owner</Label>);
        }
        labels.push(<Label bsStyle="info" key="time" style={badgeStyle}>{this.props.challenge.time}</Label>);
        labels.push(<Label bsStyle="info" key="code" style={badgeStyle}>{this.props.challenge.code}</Label>);

        var stackedItems = this.state.members.map(m => {
            return {
                value: m.total[this.props.challenge.time] || 0,
                label: m.user.ebird_username,
            };
        });

        return (
            <HomePanel>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        {labels}
                    </div>
                    {this.renderSettings()}
                </div>
                <h3>
                    <Link to={{
                        pathname: '/challenge',
                        query: {
                            id: this.props.challengeId,
                        },
                    }}>
                        {this.props.challenge.name}
                    </Link>
                </h3>
                <StackedList items={stackedItems} />
            </HomePanel>
        );
    },
}));

var ChallengeWrapper = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState() {
        return {
            challenge: null,
        };
    },

    componentWillMount() {
        this.challengesRef = firebaseRef.child('challenges').child(this.props.id);
        this.bindAsObject(this.challengesRef, 'challenge');
    },

    render() {
        if (!this.state.challenge || this.state.deleting) {
            return <div/>;
        }

        return (
            <div>
                <Challenge {...this.props} challenge={this.state.challenge} challengeId={this.props.id} />
            </div>
        );
    },
});

module.exports = ChallengeWrapper;

