var React = require('react');

var monthNames = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli',
    'August', 'September', 'Oktober', 'November', 'Desember'];
var calHeader = [<th>ma</th>, <th>ti</th>, <th>on</th>, <th>to</th>,
    <th>fr</th>, <th>lø</th>, <th>sø</th>];

var DateCell = require('./dateCell.jsx');

var MonthCalendar = React.createClass({
    render() {
        var now = this.props.month;

        // Correcting for the fact that Sunday is the first day in JavaScript,
        // while we consider Monday to be first.
        var firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay() - 1;
        if (firstDay < 0) firstDay = 6;
        var daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();

        var weeks = this._generateRows(firstDay, daysInMonth);

        return (
            <div className="month">
                <h3>{monthNames[now.getMonth()]}, {now.getFullYear()}</h3>
                <table className="month-table">
                    <thead><tr>{calHeader}</tr></thead>
                    <tbody>{weeks}</tbody>
                </table>
            </div>
        );
    },

    _generateRows(firstDay, daysInMonth) {
        var absenceDays = this.props.absenceDays;

        let weeks = [];

        // TODO: Dynamically find # of weeks (rows).
        for (let w = 0; w < 6; w++) {
            let days = [];
            for (let d = 0; d < 7; d++) {
                let day = w * 7 + d;

                let date = !(day < firstDay || day - firstDay >= daysInMonth) ?
                    (day - firstDay) + 1 : null;

                let absenceDay = absenceDays && date && absenceDays[date] ?
                    absenceDays[date] : null;

                days.push(<DateCell absenceDay={absenceDay} date={date}/>);
            }

            weeks.push(<tr className="week">{days}</tr>);
        }

        return weeks;
    },
});

module.exports = MonthCalendar;
