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
    sortedList = sortedList.splice(0, Math.min(props.diff, 3)).map(s => {
        return (
            <div key={s.commonName} style={{whiteSpace: 'nowrap'}}>{s.commonName}</div>
        );
    });
    if (props.diff > 3) {
        if (props.diff == 4) {
            sortedList.push('plus 1 other');
        } else {
            sortedList.push(`plus ${props.diff - 3} others`);
        }
    }
    return (
        <div>
            {sortedList}
        </div>
    );
};

module.exports = ListDiff;
