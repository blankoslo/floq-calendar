var React = require('react');
var ReactDOM = require('react-dom');
var Fluxxor = require('fluxxor');
import { Router, Route, IndexRoute } from 'react-router'

var AbsenceTypeStore = require('./stores/absenceTypeStore.js');
var AbsenceStore = require('./stores/absenceStore.js');
var stores = {
    AbsenceTypeStore: new AbsenceTypeStore(),
    AbsenceStore: new AbsenceStore()
}

var actions = require('./actions.js');

var flux = new Fluxxor.Flux(stores, actions);

// TODO: Only for debugging, remove later.
flux.on('dispatch', function(type, payload) {
    console.log("Dispatch:", type, payload);
});

var AppWrapper = require('./components/appWrapper.jsx');
var MonthCalendarList = require('./components/monthCalendarList.jsx');

import createBrowserHistory from 'history/lib/createBrowserHistory'
var history = createBrowserHistory();

function createFluxComponent(Component, props) {
    return <Component {...props} flux={flux}/>;
}

ReactDOM.render((
    <Router history={history} createElement={createFluxComponent}>
        <Route path="/" component={AppWrapper}>
            <IndexRoute component={MonthCalendarList}/>
        </Route>
    </Router>
), document.getElementById('app'));
