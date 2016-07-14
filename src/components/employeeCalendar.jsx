const React = require('react');

const AbsenceTypeSelector = require('./absenceTypeSelector.jsx');
const EmployeeSelector = require('./employeeSelector.jsx');
const MonthCalendarList = require('./monthCalendarList.jsx');

const EmployeeCalendar = (props) => {
  const employeeId = parseInt(props.params.employeeId);

  return (
    <div>
      <div className='top-fixed-menu'>
        <AbsenceTypeSelector />
        <EmployeeSelector selected={employeeId} />
      </div>
      <MonthCalendarList employeeId={employeeId} />
    </div>);
};

EmployeeCalendar.propTypes = {
  params: React.PropTypes.object.isRequired
};

module.exports = EmployeeCalendar;
