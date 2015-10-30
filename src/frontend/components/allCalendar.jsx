var React = require('react');
var Fluxxor = require('fluxxor');

var EmployeeRowCalendar = require('./employeeRowCalendar.jsx');

var AllCalendar = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
        Fluxxor.StoreWatchMixin('EmployeeStore')
    ],

    componentWillMount() {
        this.getFlux().actions.loadEmployees();
    },

    getStateFromFlux() {
        var employees = this.getFlux().store('EmployeeStore').employees;

        console.log("employees", employees);

        return {employees}
    },

    render() {
        var employeeRowCalendars = this.state.employees.map((employee) => {
            return <EmployeeRowCalendar employee={employee}/>
        });

        for (let i = 0; i < 100; i++) {
            employeeRowCalendars.push(<EmployeeRowCalendar employee={{first_name: "Test", last_name: "Testesen" }}/>);
        }

        return (
            <div id='all-calendar'>
               <div className='all-calendar-outer'>
                   <div className='all-calendar-inner'>
                       <table id='all-calendar-table'>
                           <tbody>
                               {employeeRowCalendars}
                           </tbody>
                       </table>
                   </div>
               </div>
            </div>
        );
    }
});

module.exports = AllCalendar;
