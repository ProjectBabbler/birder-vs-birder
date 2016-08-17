var React = require('react');

var ListDiff = (props) => {
    if (props.diff <= 0) {
        return <div />;
    }

    // Copy the list because "sort" is in place.
    var sortedList = [...props.list];
    sortedList = sortedList.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    sortedList = sortedList.splice(0, props.diff).map(s => {
        return (
            <div key={s.commonName} style={{whiteSpace: 'nowrap'}}>{s.commonName}</div>
        );
    });
    return (
        <div>
            {sortedList}
        </div>
    );
};

module.exports = ListDiff;
