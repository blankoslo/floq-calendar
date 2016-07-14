const React = require('react');
const ReactDOM = require('react-dom');
const Fluxxor = require('fluxxor');

import { Router, Route, IndexRoute } from 'react-router';

const EmployeeStore = require('./stores/employeeStore.js');
const AbsenceTypeStore = require('./stores/absenceTypeStore.js');
const AbsenceStore = require('./stores/absenceStore.js');

const stores = {
  EmployeeStore: new EmployeeStore(),
  AbsenceTypeStore: new AbsenceTypeStore(),
  AbsenceStore: new AbsenceStore()
};

import createHistory from 'history/lib/createBrowserHistory';
const history = createHistory();

const actions = require('./actions.js')(history);
const flux = new Fluxxor.Flux(stores, actions);

const AppWrapper = require('./components/appWrapper.jsx');
const LinkPage = require('./components/linkPage.jsx');
const AllCalendar = require('./components/allCalendar.jsx');
const EmployeeCalendar = require('./components/employeeCalendar.jsx');

function createFluxComponent(Component, props) {
  return <Component {...props} flux={flux} />;
}

ReactDOM.render((
  <Router history={history} createElement={createFluxComponent}>
    <Route path='/calendar' component={AppWrapper}>
      <IndexRoute component={LinkPage} />
      <Route path='/calendar/all' component={AllCalendar} />
      <Route path='/calendar/:employeeId' component={EmployeeCalendar} />
    </Route>
  </Router>
), document.getElementById('app'));
