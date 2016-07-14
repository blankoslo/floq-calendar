const React = require('react');
const ReactDOM = require('react-dom');
const Fluxxor = require('fluxxor');

const MonthCalendar = require('./monthCalendar.jsx');

const MonthCalendarList = React.createClass({
  propTypes: {
    employeeId: React.PropTypes.number.isRequired
  },

  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('AbsenceStore')
  ],

  getInitialState() {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 12, 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 13, 0);

    return { now, from, to };
  },

  componentDidMount() {
    // Load initial data
    this.loadAbsenceDays();

    this.scrollable = document.getElementsByTagName('main')[0];
    this.oldScrollHeight = this.scrollable.scrollHeight;
    setTimeout(() => {
      this.scrollable.scrollTop = this.initialScrollTop();
      this.scrollable.addEventListener('scroll', this.handleScroll);
    });
  },

  componentDidUpdate() {
    const domNode = this.scrollable;
    if (this.state.add === 'top') {
      domNode.scrollTop = (domNode.scrollHeight - this.oldScrollHeight) + domNode.scrollTop;
    }

    this.oldScrollHeight = domNode.scrollHeight;

    if (!this.state.absenceDays[this.props.employeeId]) {
      this.loadAbsenceDays();
    }
  },


  componentWillUnmount() {
    this.scrollable.removeEventListener('scroll', this.handleScroll);
  },

  getStateFromFlux() {
    const absenceDays = this.getFlux().store('AbsenceStore').absenceDays;

    return {
      absenceDays,
      add: 'none'
    };
  },

  handleScroll() {
    const domNode = this.scrollable;

    // Top:
    if (domNode.scrollTop < 100) {
      const from = new Date(this.state.from.getFullYear(), this.state.from.getMonth() - 12, 1);

      this.setState({ from, add: 'top' });
      this.loadAbsenceDays();
    }

    // Bottom:
    const nodeHeight = domNode.getBoundingClientRect().height;
    if (domNode.scrollTop + nodeHeight > domNode.scrollHeight - 100) {
      const to = new Date(
        this.state.to.getFullYear(), this.state.to.getMonth() + 13, 0);

      this.setState({ to, add: 'bottom' });
      this.loadAbsenceDays();
    }
  },

  loadAbsenceDays() {
    const employee = this.props.employeeId;
    const from = this.state.from;
    const to = this.state.to;

    this.getFlux().actions.loadAbsenceDays(employee, from, to);
  },

  initialScrollTop() {
    const monthComponent = this.refs.thisMonth;
    if (!monthComponent) return 0;

    const domNode = ReactDOM.findDOMNode(monthComponent);
    if (!domNode) return 0;

    // TODO: Ultrahack to set correct offset with fixed headers. FIXME!
    return domNode.offsetTop - 100;
  },

  // TODO: Move this processing to the backend?
  // TODO: or to the AbsenceStore?
  // TODO: Currently this is called for every add...
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
    const absenceDays = this.state.absenceDays[this.props.employeeId] ?
      this.splitByMonth(this.state.absenceDays[this.props.employeeId]) : {};

    const months = [];

    for (let m = new Date(this.state.from.getTime());
    m.getTime() < this.state.to.getTime();
    m = new Date(m.getFullYear(), m.getMonth() + 1, 1)) {
      // Give each month the absence days within it.
      const yearKey = m.getFullYear().toString();
      const monthKey = m.getMonth().toString();

      let monthAbsenceDays;
      if (absenceDays[yearKey] && absenceDays[yearKey][monthKey]) {
        monthAbsenceDays = absenceDays[yearKey][monthKey];
      } else {
        monthAbsenceDays = {};
      }

      let ref;

      if (this.state.now.getFullYear() === m.getFullYear()
        && this.state.now.getMonth() === m.getMonth()) {
        ref = 'thisMonth';
      }

      months.push(
        <MonthCalendar
          key={`monthcal-${yearKey}-${monthKey}`} month={m} absenceDays={monthAbsenceDays}
          ref={ref} employeeId={this.props.employeeId}
        />);
    }

    return <div className='mdl-grid'>{months}</div>;
  }

});

module.exports = MonthCalendarList;
