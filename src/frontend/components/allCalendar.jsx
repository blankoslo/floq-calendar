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
        this._loadAbsenceDays();
    },

    componentDidMount() {
        var scrollable = ReactDOM.findDOMNode(this.refs.scrollable);

        scrollable.scrollLeft = this._initialScrollLeft();

        scrollable.addEventListener('scroll', this.handleScroll);

        this.oldScrollWidth = scrollable.scrollWidth;
    },

    componentWillUnmount() {
        ReactDOM.findDOMNode(this.refs.scrollable)
                .removeEventListener('scroll', this.handleScroll);
    },

    componentDidUpdate() {
        var scrollable = ReactDOM.findDOMNode(this.refs.scrollable);

        if (this.state.add === 'left') {
            scrollable.scrollLeft = (scrollable.scrollWidth - this.oldScrollWidth)
                    + scrollable.scrollLeft;
        }

        this.oldScrollWidth = scrollable.scrollWidth;
    },

    handleScroll(event) {
        var domNode = ReactDOM.findDOMNode(this.refs.scrollable);

        // Left:
        if (domNode.scrollLeft < 100) {
            var from = new Date(
                    this.state.from.getFullYear(),
                    this.state.from.getMonth()-12,
                    1
            );

            //this.setState({from: from, to: this.state.from});
            this.setState({from: from, add: 'left'});
            this._loadAbsenceDays();
        }

        // Right:
        var nodeWidth = domNode.getBoundingClientRect().width;
        if (domNode.scrollLeft + nodeWidth > domNode.scrollWidth - 100) {
            var to = new Date(
                    this.state.to.getFullYear(),
                    this.state.to.getMonth()+13,
                    0
            );

            //this.setState({from: this.state.to, to: to});
            this.setState({to: to, add: 'right'});
            this._loadAbsenceDays();
        }

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
        );
    },

    _loadAbsenceDays() {
        this.getFlux().actions.loadAbsenceDays(
                        null, this.state.from, this.state.to);
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
