var React = require('react');
var Fluxxor = require('fluxxor');

var MonthCalendar = require('./monthCalendar.jsx');
var AbsenceTypeSelector = require('./absenceTypeSelector.jsx');

var MonthCalendarList = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
        Fluxxor.StoreWatchMixin('AbsenceStore', 'RangeStore')
    ],

    componentDidMount() {
        // Load initial data
        // TODO: No support for range or filtering employees yet. To come.
        var range = this.state.range;
        this.getFlux().actions.loadAbsenceDays(null, range.from, range.to);
    },

    getStateFromFlux() {
        var allAbsenceDays = this.getFlux().store('AbsenceStore').absenceDays;

        var sorted = allAbsenceDays.length !== 0 ?
            this._splitByMonth(allAbsenceDays) : [];


        var range = this.getFlux().store('RangeStore').range

        return {
            absenceDays: sorted,
            range
        }
    },

    render() {
        // TODO: Lots of hardcoding.
        //var now = this.state.range.now;
        var months = [];
        for (let m = new Date(this.state.range.from.getTime());
             m.getTime() < this.state.range.to.getTime();
             m = new Date(m.getFullYear(), m.getMonth()+1, 1)) {
            // Give each month the absence days within it.
            let yearKey = m.getFullYear().toString();
            let monthKey = m.getMonth().toString();

            let absenceDays;
            if (this.state.absenceDays[yearKey]
                    && this.state.absenceDays[yearKey][monthKey]) {
                absenceDays = this.state.absenceDays[yearKey][monthKey];
            } else {
                absenceDays = {};
            }

            months.push(<MonthCalendar month={m} absenceDays={absenceDays}/>);
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
