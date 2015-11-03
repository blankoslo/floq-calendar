var React = require('react');

var monthNames = require('./../constants.js').MONTH_NAMES;
var calHeader = [<th>ma</th>, <th>ti</th>, <th>on</th>, <th>to</th>,
    <th>fr</th>, <th>lø</th>, <th>sø</th>];

var DateCell = require('./dateCell.jsx');

var MonthCalendar = React.createClass({
    render() {
        var now = this.props.month;

        return (
            <div className="month">
                <h3>{monthNames[now.getMonth()]}, {now.getFullYear()}</h3>
                <table className="month-table">
                    <thead><tr>{calHeader}</tr></thead>
                    <tbody>{this._generateRows(now)}</tbody>
                </table>
            </div>
        );
    },

    _generateRows(now) {
        // Correcting for the fact that Sunday is the first day in JavaScript,
        // while we consider Monday to be first.
        var firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay() - 1;
        if (firstDay < 0) firstDay = 6;
        var daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();

        var absenceDays = this.props.absenceDays;

        let weeks = [];

        // TODO: Dynamically find # of weeks (rows).
        for (let w = 0; w < 6; w++) {
            let days = [];
            for (let d = 0; d < 7; d++) {
                let cell = w * 7 + d;

                let date = !(cell < firstDay || cell - firstDay >= daysInMonth) ?
                    (cell - firstDay) + 1 : null;

                let absenceDay = absenceDays && date && absenceDays[date] ?
                    absenceDays[date] : null;

                let fullDate = date !== null ?
                    new Date(now.getFullYear(), now.getMonth(), date) : null;
                days.push(<DateCell absenceDay={absenceDay} date={fullDate} employeeId={this.props.employeeId}/>);
            }

            weeks.push(<tr className="week">{days}</tr>);
        }

        return weeks;
    },
});

module.exports = MonthCalendar;
