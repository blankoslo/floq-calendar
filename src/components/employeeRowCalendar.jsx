var React = require('react');
var Fluxxor = require('fluxxor');
import { Link } from 'react-router';

var constants = require('./../constants.js');

var EmployeeRowCalendar = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
        Fluxxor.StoreWatchMixin('AbsenceStore')
    ],

    getStateFromFlux() {
        var absenceDays = this.getFlux().store('AbsenceStore').absenceDays;

        return {absenceDays};
    },

    render() {
        var employee = this.props.employee;

        var employeeId = employee.id.toString();

        var absenceDays = this.state.absenceDays[employeeId] ?
            this._splitByMonth(this.state.absenceDays[employeeId]) : {};

        var days = []
        for (let d = new Date(this.props.range.from.getTime());
             d.getTime() < this.props.range.to.getTime();
             d = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1)) {
            let yearKey = d.getFullYear().toString();
            let monthKey = d.getMonth().toString();
            let dateKey = d.getDate().toString();

            let style = {}
            if (absenceDays[yearKey] && absenceDays[yearKey][monthKey]
                    && absenceDays[yearKey][monthKey][dateKey]) {
                var type = absenceDays[yearKey][monthKey][dateKey].type;
                style.backgroundColor = constants.ABSENCE_TYPE_COLORS[type];
            }
            days.push(<td style={style}><div className='side-scroll-table-cell'></div></td>);
        }

        return (
            <tr>
                <th className='side-scroll-table-left-header'><Link to={`/calendar/${employee.id}`}>{employee.first_name} {employee.last_name}</Link></th>
                {days}
            </tr>
        );
    },

    // TODO: Copied from MonthCalendarList.. DRY!
    _splitByMonth(allAbsenceDays) {
        var output = {}

        // Split raw data into bins for year, month, day.
        allAbsenceDays.forEach((absenceDay) => {
            var fullDate = new Date(absenceDay.date);
            var year = fullDate.getFullYear().toString();
            var month = fullDate.getMonth().toString();
            var date = fullDate.getDate().toString();

            if (!output[year]) output[year] = {};
            if (!output[year][month]) output[year][month] = {};

            output[year][month][date] = absenceDay;
        });

        return output;

    }
});

module.exports = EmployeeRowCalendar;
