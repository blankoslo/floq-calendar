var React = require('react');
var Fluxxor = require('fluxxor');

var EmployeeRowCalendar = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React)
    ],

    render() {
        var employee = this.props.employee;
        return (
            <tr>
                <th className='employee-name'>{employee.first_name} {employee.last_name}</th>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
                <td>blerg</td>
            </tr>
        );
    }
});

module.exports = EmployeeRowCalendar;
