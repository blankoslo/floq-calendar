var React = require('react');
var ReactDOM = require('react-dom');
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
        this._loadAbsenceDays();

        var domNode = ReactDOM.findDOMNode(this);

        this.oldScrollHeight = domNode.scrollHeight;
        domNode.scrollTop = this._initialScrollTop();
        domNode.addEventListener('scroll', this.handleScroll);
    },

    componentWillUnmount() {
        ReactDOM.findDOMNode(this).removeEventListener('scroll', this.handleScroll);
    },

    handleScroll(event) {
        var domNode = ReactDOM.findDOMNode(this);

        // Top:
        if (domNode.scrollTop < 100) {
            var from = new Date(
                    this.state.from.getFullYear(),
                    this.state.from.getMonth()-12,
                    1
            );

            //this.setState({from: from, to: this.state.from});
            this.setState({from: from, add: 'top'});
            this._loadAbsenceDays();
        }

        // Bottom:
        var nodeHeight = domNode.getBoundingClientRect().height;
        if (domNode.scrollTop + nodeHeight > domNode.scrollHeight - 100) {
            var to = new Date(
                    this.state.to.getFullYear(),
                    this.state.to.getMonth()+13,
                    0
            );

            //this.setState({from: this.state.to, to: to});
            this.setState({to: to, add: 'bottom'});
            this._loadAbsenceDays();
        }

    },

    componentDidUpdate() {
        var domNode = ReactDOM.findDOMNode(this);
        if (this.state.add === 'top') {
            domNode.scrollTop = (domNode.scrollHeight - this.oldScrollHeight)
                    + domNode.scrollTop;
        }

        this.oldScrollHeight = domNode.scrollHeight;

        if (!this.state.absenceDays[this.props.employeeId]) {
            this._loadAbsenceDays();
        }
    },

    getInitialState() {
        var now = new Date();
        var from = new Date(
                now.getFullYear(),
                now.getMonth()-12,
                1
        );
        var to = new Date(
                now.getFullYear(),
                now.getMonth()+13,
                0
        );

        return {now, from, to};
    },

    getStateFromFlux() {
        var absenceDays = this.getFlux().store('AbsenceStore').absenceDays;

        return {
            absenceDays,
            add: 'none'
        }
    },

    render() {
        var absenceDays = this.state.absenceDays[this.props.employeeId] ?
                this._splitByMonth(this.state.absenceDays[this.props.employeeId])
                : {};
        var months = [];
        for (let m = new Date(this.state.from.getTime());
             m.getTime() < this.state.to.getTime();
             m = new Date(m.getFullYear(), m.getMonth()+1, 1)) {
            // Give each month the absence days within it.
            let yearKey = m.getFullYear().toString();
            let monthKey = m.getMonth().toString();

            let monthAbsenceDays;
            if (absenceDays[yearKey]
                    && absenceDays[yearKey][monthKey]) {
                monthAbsenceDays = absenceDays[yearKey][monthKey];
            } else {
                monthAbsenceDays = {};
            }

            let ref;
            if (this.state.now.getFullYear() == m.getFullYear()
                    && this.state.now.getMonth() == m.getMonth()) {
                ref = "thisMonth";
            }
            months.push(<MonthCalendar
                            month={m}
                            absenceDays={monthAbsenceDays}
                            ref={ref}
                            employeeId={this.props.employeeId}
                        />);
        }

        return (
            <div id="month-list">
                {months}
            </div>
        );
    },

    _loadAbsenceDays() {
        var employee = this.props.employeeId;
        var from = this.state.from, to = this.state.to;
        this.getFlux().actions.loadAbsenceDays(employee, from, to);
    },

    _initialScrollTop() {
        var monthComponent = this.refs.thisMonth;
        if (!monthComponent) return 0;

        var domNode = ReactDOM.findDOMNode(monthComponent);
        if (!domNode) return 0;

        return domNode.offsetTop;
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
