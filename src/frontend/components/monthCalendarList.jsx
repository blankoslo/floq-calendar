var React = require('react');

var MonthCalendar = require('./monthCalendar.jsx');

var MonthCalendarList = React.createClass({
    render() {
        // TODO: Lots of hardcoding.
        var curDate = new Date();
        var months = [];
        for (let i = 0; i <= 12; i++) {
            months.push(<MonthCalendar now={curDate} offset={i}/>); 
        }

        return (
            <div className="month-list">
                {months}
            </div>
        );
    }
});

module.exports = MonthCalendarList;
