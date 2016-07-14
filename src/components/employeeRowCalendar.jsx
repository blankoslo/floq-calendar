const React = require('react');
const Fluxxor = require('fluxxor');
import { Link } from 'react-router';

const constants = require('./../constants.js');

const EmployeeRowCalendar = React.createClass({
  propTypes: {
    employee: React.PropTypes.object.isRequired,
    range: React.PropTypes.object.isRequired
  },

  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('AbsenceStore')
  ],

  getStateFromFlux() {
    const absenceDays = this.getFlux().store('AbsenceStore').absenceDays;
    return { absenceDays };
  },

  // TODO: Copied from MonthCalendarList.. DRY!
  splitByMonth(allAbsenceDays) {
    const output = {};

    // Split raw data into bins for year, month, day.
    allAbsenceDays.forEach((absenceDay) => {
      const fullDate = new Date(absenceDay.date);
      const year = fullDate.getFullYear().toString();
      const month = fullDate.getMonth().toString();
      const date = fullDate.getDate().toString();

      if (!output[year]) output[year] = {};
      if (!output[year][month]) output[year][month] = {};
      output[year][month][date] = absenceDay;
    });

    return output;
  },

  render() {
    const employee = this.props.employee;
    const employeeId = employee.id.toString();

    const absenceDays = this.state.absenceDays[employeeId] ?
    this.splitByMonth(this.state.absenceDays[employeeId]) : {};

    const days = [];
    for (let d = new Date(this.props.range.from.getTime());
    d.getTime() < this.props.range.to.getTime();
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
      const yearKey = d.getFullYear().toString();
      const monthKey = d.getMonth().toString();
      const dateKey = d.getDate().toString();

      let style = {};
      if (absenceDays[yearKey] && absenceDays[yearKey][monthKey]
                    && absenceDays[yearKey][monthKey][dateKey]) {
        const billable = absenceDays[yearKey][monthKey][dateKey].project.billable;
        style.backgroundColor = constants.ABSENCE_TYPE_COLORS[billable];
      } else if (d.getDay() === 6 || d.getDay() === 0) {
        style.backgroundColor = constants.ABSENCE_TYPE_COLORS.weekend;
      }

      days.push(
        <td key={`days-${d}-${employeeId}`} style={style}>
          <div className='side-scroll-table-cell'></div>
        </td>);
    }

    return (
      <tr>
        <th className='side-scroll-table-left-header'>
          <Link to={`/calendar/${employee.id}`}>{employee.first_name} {employee.last_name}</Link>
        </th>
        {days}
      </tr>);
  }
});

module.exports = EmployeeRowCalendar;
