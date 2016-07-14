const React = require('react');
const ReactDOM = require('react-dom');
const Fluxxor = require('fluxxor');

const AllCalendarHead = require('./allCalendarHead.jsx');
const EmployeeRowCalendar = require('./employeeRowCalendar.jsx');

const AllCalendar = React.createClass({
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('EmployeeStore')
  ],

  getInitialState() {
    // TODO: Generate now in one place.
    const now = new Date();
    const from = new Date(
      now.getFullYear(),
      now.getMonth() - 12,
      1);

    const to = new Date(
      now.getFullYear(),
      now.getMonth() + 13,
      0);

    return { now, from, to };
  },

  componentWillMount() {
    this.getFlux().actions.loadEmployees();
    this.loadAbsenceDays();
  },

  componentDidMount() {
    const scrollable = ReactDOM.findDOMNode(this.refs.scrollable);
    this.oldScrollWidth = scrollable.scrollWidth;

    setTimeout(() => {
      scrollable.scrollLeft = this.initialScrollLeft();
      scrollable.addEventListener('scroll', this.handleScroll);
    });
  },

  componentDidUpdate() {
    const scrollable = ReactDOM.findDOMNode(this.refs.scrollable);

    if (this.state.add === 'left') {
      scrollable.scrollLeft = (scrollable.scrollWidth - this.oldScrollWidth)
      + scrollable.scrollLeft;
    }

    this.oldScrollWidth = scrollable.scrollWidth;
  },

  componentWillUnmount() {
    ReactDOM.findDOMNode(this.refs.scrollable)
    .removeEventListener('scroll', this.handleScroll);
  },

  getStateFromFlux() {
    const employees = this.getFlux().store('EmployeeStore').employees;
    return { employees };
  },

  handleScroll() {
    const domNode = ReactDOM.findDOMNode(this.refs.scrollable);

    // Left:
    if (domNode.scrollLeft < 100) {
      const from = new Date(
        this.state.from.getFullYear(),
        this.state.from.getMonth() - 12,
        1);

      // this.setState({from: from, to: this.state.from});
      this.setState({ from, add: 'left' });
      this.loadAbsenceDays();
    }

    // Right:
    const nodeWidth = domNode.getBoundingClientRect().width;
    if (domNode.scrollLeft + nodeWidth > domNode.scrollWidth - 100) {
      const to = new Date(
        this.state.to.getFullYear(),
        this.state.to.getMonth() + 13,
        0);

      // this.setState({from: this.state.to, to: to});
      this.setState({ to, add: 'right' });
      this.loadAbsenceDays();
    }
  },

  initialScrollLeft() {
    const monthComponent = this.refs.head.getThisMonth();
    if (!monthComponent) return 0;

    const domNode = ReactDOM.findDOMNode(monthComponent);
    if (!domNode) return 0;
    return domNode.offsetLeft;
  },

  loadAbsenceDays() {
    this.getFlux().actions.loadAbsenceDays(
      null, this.state.from, this.state.to);
  },

  render() {
    const range = { from: this.state.from, to: this.state.to };
    const employeeRowCalendars = this.state.employees.map((employee) =>
      <EmployeeRowCalendar
        key={`employeerow${employee.id}`}
        employee={employee} range={range}
      />);

    return (
      <div className='side-scroll-table-outer' style={{ paddingTop: '10px' }}>
        <div className='side-scroll-table-inner' ref='scrollable'>
          <table id='side-scroll-table'>
            <AllCalendarHead range={range} now={this.state.now} ref='head' />
            <tbody>
              {employeeRowCalendars}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

});

module.exports = AllCalendar;
