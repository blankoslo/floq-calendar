var React = require('react');

var monthNames = require('./../constants.js').MONTH_NAMES;

var AllCalendarHead = React.createClass({
    render() {
        var months = [], weeks = [], days = [];
        for (let d = new Date(this.props.range.from.getTime());
             d.getTime() < this.props.range.to.getTime();
             d = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1)) {
            var date = d.getDate();
            days.push(<th>{date}</th>);
            
            if (date == 1) {
                var span = new Date(d.getFullYear(), d.getMonth()+1, 0).getDate();
                months.push(<th 
                    className='month-header'
                    colSpan={span}>
                        {monthNames[d.getMonth()]}, {d.getFullYear()}</th>);
            }
        }

        return (
            <thead>
                <tr><th className='employee-name'></th>{months}</tr>
                <tr><th className='employee-name'></th>{days}</tr>             
            </thead>
        );
    }
});

module.exports = AllCalendarHead;
