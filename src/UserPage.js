var React = require('react');
var LoadingOverlay = require('./LoadingOverlay');
var axios = require('axios');
var BirdListGraph = require('./BirdListGraph');
var UserUtils = require('../utils/UserUtils');


var UserPage = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
        userData: React.PropTypes.object,
    },

    getInitialState() {
        return {
            loading: false,
            lists: null,
        };
    },

    componentDidMount() {
        this.getUserData();
    },

    getUserData(props=this.props) {
        this.setState({
            loading: true,
        });

        axios.post('/api/userLists', {
            username: props.params.username,
        }).then((results) => {
            this.setState({
                lists: results.data,
            });
        }).catch((err) => {
            console.log(err);
        }).then(() => {
            this.setState({
                loading: false,
            });
        });

        UserUtils.getUserByName(props.params.username).then((user) => {
            this.setState({
                userData: user,
            });
        });
    },

    render() {
        if (!this.state.userData) {
            return <LoadingOverlay isOpened={true} />;
        }

        return (
            <div>
                <LoadingOverlay isOpened={this.state.loading} />
                <div style={{
                    textAlign: 'right',
                    fontStyle: 'italic',
                }}>
                    Graphs updated every 4 hours
                </div>
                <h3>{this.state.userData.fullname}</h3>
                <BirdListGraph lists={this.state.lists} title="World Bird List" />
            </div>
        );
    },
});

module.exports = UserPage;