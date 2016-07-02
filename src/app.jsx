var React = require('react');
var ReactDOM = require('react-dom');
var Fluxxor = require('fluxxor');
import { Router, Route, IndexRoute } from 'react-router'

var EmployeeStore = require('./stores/employeeStore.js');
var AbsenceTypeStore = require('./stores/absenceTypeStore.js');
var AbsenceStore = require('./stores/absenceStore.js');

var stores = {
    EmployeeStore: new EmployeeStore(),
    AbsenceTypeStore: new AbsenceTypeStore(),
    AbsenceStore: new AbsenceStore()
}

import createHistory from 'history/lib/createBrowserHistory'
var history = createHistory();

var actions = require('./actions.js')(history);

var flux = new Fluxxor.Flux(stores, actions);

// TODO: Only for debugging, remove later.
flux.on('dispatch', function(type, payload) {
    console.log("Dispatch:", type, payload);
});

var AppWrapper = require('./components/appWrapper.jsx');
var LinkPage = require('./components/linkPage.jsx');
var AllCalendar = require('./components/allCalendar.jsx');
var EmployeeCalendar = require('./components/employeeCalendar.jsx');

function createFluxComponent(Component, props) {
    return <Component {...props} flux={flux}/>;
}

ReactDOM.render((
    <Router history={history} createElement={createFluxComponent}>
        <Route path="/calendar" component={AppWrapper}>
            <IndexRoute component={LinkPage}/>
            <Route path="/calendar/all" component={AllCalendar}/>
            <Route path="/calendar/:employeeId" component={EmployeeCalendar}/>
        </Route>
    </Router>
), document.getElementById('app'));
