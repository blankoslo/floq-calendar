const React = require('react');
const Fluxxor = require('fluxxor');

const constants = require('./../constants.js');

const DateCell = React.createClass({
  propTypes: {
    absenceDay: React.PropTypes.object,
    employeeId: React.PropTypes.number,
    date: React.PropTypes.object,
    day: React.PropTypes.number
  },

  mixins: [
    Fluxxor.FluxMixin(React),
  ],

  handleClick() {
    const selected = this.getFlux().store('AbsenceTypeStore').selected;
    const absenceDay = this.props.absenceDay;

    if (!absenceDay) {
      this.getFlux().actions.createAbsenceDay(this.props.employeeId, selected, this.props.date);
      return;
    }

    if (!(absenceDay.project.id === selected)) {
      this.getFlux().actions.updateAbsenceDay(selected, this.props.absenceDay);
      return;
    }

    this.getFlux().actions.deleteAbsenceDay(absenceDay);
  },

  generateStyles() {
    if (this.props.absenceDay) {
      return {
        color: 'white',
        backgroundColor: constants.ABSENCE_TYPE_COLORS[this.props.absenceDay.project.billable]
      };
    } else if (this.props.day === 5 || this.props.day === 6) {
      return { backgroundColor: constants.ABSENCE_TYPE_COLORS.weekend };
    } return {};
  },

  render() {
    const date = this.props.date;
    const name = this.props.absenceDay ? this.props.absenceDay.project.name : '';

    return (
      <td
        onClick={this.handleClick}
        className='day'
        style={this.generateStyles()}
        title={name}
      >
        {date ? date.getDate() : null}
      </td>
     );
  }
});

module.exports = DateCell;
