var React = require('react');
var ReactDOM = require('react-dom');
var Fluxxor = require('fluxxor');

var AllCalendarHead = require('./allCalendarHead.jsx');
var EmployeeRowCalendar = require('./employeeRowCalendar.jsx');

var AllCalendar = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
        Fluxxor.StoreWatchMixin('EmployeeStore')
    ],

    componentWillMount() {
        this.getFlux().actions.loadEmployees();
        this.getFlux().actions.loadAbsenceDays(
                null, this.state.from, this.state.to
        );
    },

    componentDidMount() {
        var domNode = ReactDOM.findDOMNode(this.refs.scrollable);

        domNode.scrollLeft = this._initialScrollLeft();
    },

    getInitialState() {
        // TODO: Generate now in one place.
        var now = new Date();
        var from = new Date(
                now.getFullYear(),
                now.getMonth()-12,
                1
        );
        var to = new Date(
                now.getFullYear(),
                now.getMonth()+13,
                0
        );

        return {now, from, to};
    },

    getStateFromFlux() {
        var employees = this.getFlux().store('EmployeeStore').employees;

        return {employees}
    },

    render() {
        var range = {from: this.state.from, to: this.state.to};
        var employeeRowCalendars = this.state.employees.map((employee) => {
            return <EmployeeRowCalendar employee={employee} range={range}/>
        });

        return (
            <div id='all-calendar'>
               <div className='all-calendar-outer'>
                   <div className='all-calendar-inner' ref='scrollable'>
                       <table id='all-calendar-table'>
                           <AllCalendarHead range={range} now={this.state.now} ref='head'/>
                           <tbody>
                               {employeeRowCalendars}
                           </tbody>
                       </table>
                   </div>
               </div>
            </div>
        );
    },

    _initialScrollLeft() {
        var monthComponent = this.refs.head.getThisMonth();
        if (!monthComponent) return 0;

        var domNode = ReactDOM.findDOMNode(monthComponent);
        if (!domNode) return 0;

        return domNode.offsetLeft;
    }
});

module.exports = AllCalendar;
