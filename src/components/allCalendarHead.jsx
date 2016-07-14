const React = require('react');

const monthNames = require('./../constants.js').MONTH_NAMES;

const AllCalendarHead = React.createClass({
  propTypes: {
    range: React.PropTypes.object.isRequired,
    now: React.PropTypes.object.isRequired
  },

  getThisMonth() {
    return this.refs.thisMonth;
  },

  render() {
    const months = [];
    const days = [];

    for (let d = new Date(this.props.range.from.getTime());
      d.getTime() < this.props.range.to.getTime();
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
      const date = d.getDate();
      days.push(
        <th key={`dateheader${d}`}>
          <div className='side-scroll-table-cell'>{date}</div>
        </th>);

      if (date === 1) {
        const now = this.props.now;
        let ref;
        if (d.getYear() === now.getYear() && d.getMonth() === now.getMonth()) {
          ref = 'thisMonth';
        }
        let span = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        months.push(
          <th key={`monthheader${d}`} ref={ref} colSpan={span}>
            {monthNames[d.getMonth()]}, {d.getFullYear()}
          </th>);
      }
    }

    return (
      <thead>
        <tr className='side-scroll-table-top-header-row'>
          <th className='employee-name'></th>
          {months}
        </tr>
        <tr>
          <th className='employee-name'></th>
          {days}
        </tr>
      </thead>);
  }
});

module.exports = AllCalendarHead;
