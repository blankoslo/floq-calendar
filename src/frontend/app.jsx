var React = require('react');
var ReactDOM = require('react-dom');
//var Fluxxor = require('fluxxor');
import { Router, Route, IndexRoute } from 'react-router'

var AppWrapper = require('./components/appWrapper.jsx');
var MonthCalendarList = require('./components/monthCalendarList.jsx');

import createBrowserHistory from 'history/lib/createBrowserHistory'
var history = createBrowserHistory();
ReactDOM.render((
    <Router history={history}>
        <Route path="/" component={AppWrapper}>
            <IndexRoute component={MonthCalendarList}/>
        </Route>
    </Router>
), document.getElementById('app'));
