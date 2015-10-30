var React = require('react');
var Fluxxor = require('fluxxor');

var AbsenceTypeSelector = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
        Fluxxor.StoreWatchMixin('AbsenceTypeStore')
    ],

    componentDidMount() {
        this.getFlux().actions.loadAbsenceTypes();
    },

    getStateFromFlux() {
        var absenceTypes = this.getFlux().store('AbsenceTypeStore').absenceTypes;
        var selected = this.getFlux().store('AbsenceTypeStore').selected;

        return { 
            absenceTypes,
            selected
        };
    },

    handleChange(event) {
        this.getFlux().actions.absenceTypeChange(event.target.value);
    },

    render() {
        var options = [];
        this.state.absenceTypes.forEach((type) => {
            options.push(<option value={type.id}>{type.type}</option>);        
        });

        return (
            <select value={this.state.selected} onChange={this.handleChange}>
                {options}
            </select>
        );    
    }
});

module.exports = AbsenceTypeSelector;
