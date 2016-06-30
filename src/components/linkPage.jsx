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
            myCalendarLink = <li><Link to={`/calendar/${this.state.loggedInEmployee.id}/`}>Min kalender</Link></li>;
        }

        return (
            <div className='content-box'>
                <h4>Gå til</h4>
                <ul>
                    <li>
                        <Link to={`/calendar/all`}>Felleskalender</Link>
                    </li>
                    {myCalendarLink}
                </ul>
            </div>
        );
    }
});

module.exports = LinkPage;