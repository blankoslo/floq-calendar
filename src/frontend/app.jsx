var React = require('react');
var ReactDOM = require('react-dom');
var Fluxxor = require('fluxxor');
import { Router, Route, IndexRoute } from 'react-router'

var UserStore = require('./stores/userStore.js');
var AbsenceTypeStore = require('./stores/absenceTypeStore.js');
var AbsenceStore = require('./stores/absenceStore.js');

var stores = {
    UserStore: new UserStore(),
    AbsenceTypeStore: new AbsenceTypeStore(),
    AbsenceStore: new AbsenceStore()
}

import createBrowserHistory from 'history/lib/createBrowserHistory'
var history = createBrowserHistory();

var actions = require('./actions.js')(history);

var flux = new Fluxxor.Flux(stores, actions);

// TODO: Only for debugging, remove later.
flux.on('dispatch', function(type, payload) {
    console.log("Dispatch:", type, payload);
});

var AppWrapper = require('./components/appWrapper.jsx');
var EmployeeCalendar = require('./components/employeeCalendar.jsx');

function createFluxComponent(Component, props) {
    return <Component {...props} flux={flux}/>;
}

ReactDOM.render((
    <Router history={history} createElement={createFluxComponent}>
        <Route path="/" component={AppWrapper}>
            <Route path="/calendar/:employeeId" component={EmployeeCalendar}/>
        </Route>
    </Router>
), document.getElementById('app'));

window.googleLoaded = () => window.dispatchEvent(new Event('googleloaded'));

