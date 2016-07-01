var React = require('react');
var Fluxxor = require('fluxxor');

var EmployeeSelector = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
        Fluxxor.StoreWatchMixin('EmployeeStore')
    ],

    componentWillMount() {
        // TODO: Only load if not exists.
        this.getFlux().actions.loadEmployees();
    },

    getStateFromFlux() {
        var employees = this.getFlux().store('EmployeeStore').employees;

        return {employees};
    },

    handleChange(event) {
        this.getFlux().actions.newEmployeeSelected(event.target.value);
    },

    render() {
        var options = [];
        this.state.employees.forEach((employee) => {
            options.push(<option key={"employees" + employee.id} value={employee.id}>{employee.first_name} {employee.last_name}</option>);
        });

        return (
            <select value={this.props.selected} onChange={this.handleChange}>
                {options}
            </select>
        );
    }
});

module.exports = EmployeeSelector;
