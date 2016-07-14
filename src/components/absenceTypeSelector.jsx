const React = require('react');
const Fluxxor = require('fluxxor');

const AbsenceTypeSelector = React.createClass({
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('AbsenceTypeStore')
  ],
  componentDidMount() {
    this.getFlux().actions.loadAbsenceTypes();
  },

  getStateFromFlux() {
    const absenceTypes = this.getFlux().store('AbsenceTypeStore').absenceTypes;
    const selected = this.getFlux().store('AbsenceTypeStore').selected;

    return {
      absenceTypes,
      selected
    };
  },

  handleChange(event) {
    this.getFlux().actions.absenceTypeChange(event.target.value);
  },

  render() {
    let options = [];
    this.state.absenceTypes.forEach((type) => {
      options.push(<option key={`absence${type.id}`} value={type.id}>{type.name}</option>);
    });

    return (
      <select value={this.state.selected} onChange={this.handleChange}>
        {options}
      </select>
    );
  }
});

module.exports = AbsenceTypeSelector;
