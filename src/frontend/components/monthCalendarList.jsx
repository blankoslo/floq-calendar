var React = require('react');
var Fluxxor = require('fluxxor');

var MonthCalendar = require('./monthCalendar.jsx');
var AbsenceTypeSelector = require('./absenceTypeSelector.jsx');

var MonthCalendarList = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
        Fluxxor.StoreWatchMixin('AbsenceStore')
    ],

    componentDidMount() {
        // Load initial data
        // TODO: No support for range or filtering employees yet. To come.
        this.getFlux().actions.loadAbsenceDays();
    },

    getStateFromFlux() {
        var allAbsenceDays = this.getFlux().store('AbsenceStore').absenceDays;

        var sorted = allAbsenceDays.length !== 0 ?
            this._splitByMonth(allAbsenceDays) : [];

        return {
            absenceDays: sorted
        }
    },

    render() {
        // TODO: Lots of hardcoding.
        var curDate = new Date();
        var months = [];
        for (let i = 0; i <= 12; i++) {
            let month = new Date(
                    curDate.getFullYear(),
                    curDate.getMonth() + i,
                    curDate.getDate()
            );

            // Give each month the absence days within it.
            let yearKey = month.getFullYear().toString();
            let monthKey = month.getMonth().toString();

            let absenceDays;
            if (this.state.absenceDays[yearKey]
                    && this.state.absenceDays[yearKey][monthKey]) {
                absenceDays = this.state.absenceDays[yearKey][monthKey];
            } else {
                absenceDays = {};
            }

            months.push(<MonthCalendar month={month} absenceDays={absenceDays}/>);
        }

        return (
            <div className="month-list">
                <AbsenceTypeSelector/>
                {months}
            </div>
        );
    },

    // TODO: Move this processing to the backend?
    // TODO: or to the AbsenceStore?
    // TODO: Currently this is called for every add...
    _splitByMonth(allAbsenceDays) {
        var output = {}

        // Split raw data into bins for year, month, day.
        allAbsenceDays.forEach((absenceDay) => {
            var fullDate = new Date(absenceDay.date);
            var year = fullDate.getFullYear().toString();
            var month = fullDate.getMonth().toString();
            var date = fullDate.getDate().toString();

            if (!output[year]) output[year] = {};
            if (!output[year][month]) output[year][month] = {};

            output[year][month][date] = absenceDay;
        });

        return output;
    }
});

module.exports = MonthCalendarList;
