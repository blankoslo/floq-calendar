const React = require('react');
const Fluxxor = require('fluxxor');
import { Link } from 'react-router';

const LinkPage = React.createClass({
  mixins: [
    Fluxxor.FluxMixin(React),
    Fluxxor.StoreWatchMixin('EmployeeStore')
  ],

  componentWillMount() {
    this.getFlux().actions.getLoggedInEmployee(window.userEmail);
  },

  getStateFromFlux() {
    return { loggedInEmployee: this.getFlux().store('EmployeeStore').loggedInEmployee };
  },

  render() {
    let myCalendar;

    if (this.state.loggedInEmployee) {
      myCalendar = <Link to={`/calendar/${this.state.loggedInEmployee.id}/`}>Min kalender</Link>;
    }

    return (
      <div className='content-box'>
        <h4>Gå til</h4>
        <ul>
          <li>
            <Link to={'/calendar/all'}>Felleskalender</Link>
          </li>
          <li>
            {myCalendar}
          </li>
        </ul>
      </div>);
  }
});

module.exports = LinkPage;
