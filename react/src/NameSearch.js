var React = require('react');
var Select = require('react-select');
var lunr = require('lunr');
var firebaseApp = require('../firebase');


var NameSearch = React.createClass({
    getUsers() {
        return firebaseApp.database().ref('users').once('value').then(snap => {
            var data = snap.val();
            if (data) {
                return data;
            } else {
                return null;
            }
        });
    },

    getIndex() {
        return new Promise((resolve, reject) => {
            this.getUsers().then(users => {
                var idx = lunr(function() {
                    this.ref('key');
                    this.field('fullname', { boost: 10 });
                    this.field('ebird_username');
                    this.field('email');
                });

                for (var key in users) {
                    var user = users[key];
                    idx.add({
                        key,
                        fullname: user.fullname,
                        ebird_username: user.ebird_username,
                        email: user.email,
                    });
                }

                idx.searchResults = (query) => {
                    return idx.search(query).map(result => {
                        var user = users[result.ref];
                        return {
                            value: result.ref,
                            label: `${user.fullname} (Username: ${user.ebird_username})`,
                            user: user,
                        };
                    });
                };

                resolve(idx);
            });
        });
    },

    getInitialState() {
        return {
            index: null,
        };
    },

    componentWillMount() {
        this.getOptions();
    },

    getOptions() {
        this.getIndex().then(index => {
            this.setState({
                index,
            });
        });
    },

    loadOptions(input, callback) {
        var filtered = this.state.index ? this.state.index.searchResults(input) : [];
        var limited = filtered.slice(0, 10);

        callback(null, {
            options: limited
        });
    },

    render() {
        return (
            <Select.Async
                {...this.props}
                loadOptions={this.loadOptions}
                filterOptions={(r) => { return r; }}
            />
        );
    },
});

module.exports = NameSearch;