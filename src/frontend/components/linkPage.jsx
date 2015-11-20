var React = require('react');
var Fluxxor = require('fluxxor');
import { Link } from 'react-router'

var LinkPage = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
        Fluxxor.StoreWatchMixin('EmployeeStore')
    ],

    componentWillMount() {
        this.getFlux().actions.getLoggedInEmployee();
    },

    getStateFromFlux() {
        return {
            loggedInEmployee: this.getFlux().store('EmployeeStore').loggedInEmployee
        }
    },

    render() {
        var myCalendarLink;

        if (this.state.loggedInEmployee) {
            myCalendarLink = <Link className="appbutton bgred" to={`/calendar/${this.state.loggedInEmployee.id}/`}>Min kalender</Link>;
        }

        return (
            <div>
                <Link className="appbutton bgred" to={`/calendar/all`}>Felleskalender</Link>
                {myCalendarLink}
            </div>
        );
    }
});

module.exports = LinkPage;
