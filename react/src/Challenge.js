var React = require('react');
var HomePanel = require('./HomePanel');
var ReactFireMixin = require('reactfire');
var { Label, DropdownButton, Glyphicon }= require('react-bootstrap');
var Confirm = require('react-confirm-bootstrap');
var EditChallengeModal = require('./EditChallengeModal');
var StackedList = require('./StackedList');
var { Link } = require('react-router');
var UserUtils = require('../utils/UserUtils');
var AddFriendsModal = require('./AddFriendsModal');
var chalk = require('chalk');
var InviteeMenu = require('./InviteeMenu');
var MenuItem = require('./MenuItem');

var firebase = require('../firebase');
var firebaseRef = firebase.database();



var Challenge = React.createClass({
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
        this.challengeRef = firebaseRef.ref('challenges').child(this.props.id);
        this.challengeRef.child('members').on('value', snap => {
            var ps = [];
            snap.forEach(member => {
                ps.push(new Promise((resolve, reject) => {
                    Promise.all([
                        firebaseRef.ref('users').child(member.key).once('value'),
                        UserUtils.getRecentTotalsRef(member.key).then(ref => {
                            return ref.child(this.props.challenge.code).once('value');
                        }),
                    ]).then(result => {
                        return {
                            user: result[0].val(),
                            userKey: result[0].key,
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

        this.bindAsArray(this.challengeRef.child('invites'), 'invites');
    },

    onDelete() {
        this.setState({
            deleting: true,
        });
        var ps = [];
        this.state.members.forEach(user => {
            ps.push(firebaseRef.ref('users').child(user.userKey).child('challenges').child(this.props.id).set(null));
        });
        ps.push(this.challengeRef.set(null));

        Promise.all(ps).catch((e) => {
            console.error(chalk.red('Error'), e);
            this.setState({
                deleting: false,
            });
        });
    },

    componentWillUnmount() {
        this.challengeRef.child('members').off('value');
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
        return (
            <div>
                <DropdownButton
                    className="test-challenge-menu-dropdown"
                    title={<Glyphicon glyph="cog" />}
                    id={`delete-${this.props.id}`}
                    bsSize="xsmall">
                    <MenuItem onClick={this.onInvite} key="invite">Invite</MenuItem>
                    {this.isOwner() ? [
                        <MenuItem onClick={this.onEdit} key="edit">Edit</MenuItem>,
                        <Confirm
                            key="confirm"
                            onConfirm={this.onDelete}
                            body="Are you sure you want to delete this challenge? It can't be undone"
                            confirmText="Confirm"
                            title={`Delete "${this.props.challenge.name}"`}>
                            <MenuItem className="test-delete-challenge" key="delete">Delete</MenuItem>
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
                label: m.user.fullname,
            };
        });

        var inviteItems = this.state.invites.filter(i => {
            return this.isOwner() || i.inviter == this.context.authData.uid;
        }).map(i => {
            return {
                value: 0,
                label: i.email,
                customValueRender: <InviteeMenu {...i} challengeRef={this.challengeRef} />,
            };
        });

        stackedItems = stackedItems.concat(inviteItems);

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
});

var ChallengeWrapper = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState() {
        return {
            challenge: null,
        };
    },

    componentWillMount() {
        this.challengeRef = firebaseRef.ref('challenges').child(this.props.id);
        this.bindAsObject(this.challengeRef, 'challenge');
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

