const React = require('react');

const monthNames = require('./../constants.js').MONTH_NAMES;
const calHeader = [<th>ma</th>, <th>ti</th>, <th>on</th>, <th>to</th>,
  <th>fr</th>, <th>lø</th>, <th>sø</th>];

const DateCell = require('./dateCell.jsx');

const MonthCalendar = React.createClass({
  propTypes: {
    absenceDays: React.PropTypes.array.isRequired,
    employeeId: React.PropTypes.number.isRequired,
    month: React.PropTypes.object.isRequired
  },

  generateRows(now) {
    // Correcting for the fact that Sunday is the first day in JavaScript,
    // while we consider Monday to be first.
    let firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay() - 1;
    if (firstDay < 0) firstDay = 6;

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const absenceDays = this.props.absenceDays;

    const weeks = [];

    // TODO: Dynamically find # of weeks (rows).
    for (let w = 0; w < 6; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const cell = w * 7 + d;
        const date = !(cell < firstDay || cell - firstDay >= daysInMonth) ?
                  (cell - firstDay) + 1 : null;

        const absenceDay = absenceDays && date && absenceDays[date] ? absenceDays[date] : null;
        const fullDate = date !== null ? new Date(now.getFullYear(), now.getMonth(), date) : null;

        days.push(
          <DateCell
            key={`datecell-${fullDate}-${w}-${d}-${this.props.employeeId}`}
            absenceDay={absenceDay} date={fullDate} employeeId={this.props.employeeId} day={d}
          />);
      }

      weeks.push(<tr key={`week ${w}`} className='week'>{days}</tr>);
    }

    return weeks;
  },

  render() {
    const now = this.props.month;

    return (
      <div className='mdl-cell mdl-cell--4-col'>
        <h5>{monthNames[now.getMonth()]}, {now.getFullYear()}</h5>
        <table className='month-cal-table'>
          <colgroup span='7' className='day-col' />
          <thead><tr>{calHeader}</tr></thead>
          <tbody>{this.generateRows(now)}</tbody>
        </table>
      </div>);
  }
});

module.exports = MonthCalendar;
