var React = require('react');

var AbsenceTypeSelector = require('./absenceTypeSelector.jsx');
var EmployeeSelector = require('./employeeSelector.jsx');
var MonthCalendarList = require('./monthCalendarList.jsx');

var EmployeeCalendar = React.createClass({
    render() {
        var employeeId = parseInt(this.props.params.employeeId);
        return (
            <div>
                <div className='selectors'>
                    <AbsenceTypeSelector/>
                    <EmployeeSelector selected={employeeId}/>
                </div>
                <MonthCalendarList employeeId={employeeId}/>
            </div>
        );
    }
});

module.exports = EmployeeCalendar;
