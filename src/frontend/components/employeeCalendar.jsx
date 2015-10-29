var React = require('react');

var AbsenceTypeSelector = require('./absenceTypeSelector.jsx');
var MonthCalendarList = require('./monthCalendarList.jsx');

var EmployeeCalendar = React.createClass({
    render() {
        return (
            <div>
                <AbsenceTypeSelector/>
                <MonthCalendarList {...this.props}/>
            </div>
        );
    }
});

module.exports = EmployeeCalendar;
