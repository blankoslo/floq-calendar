var React = require('react');

function generateRows(firstDay, daysInMonth) {
    firstDay++;
    console.log("firstday", firstDay);
    console.log("dim", daysInMonth);
    let weeks = [];

    // TODO: Dynamically find # of weeks (rows).
    for (let w = 0; w < 6; w++) {
        let days = [];
        for (let d = 1; d <= 7; d++) {
            let day = w * 7 + d;
            let print;
            if (day < firstDay || day - firstDay >= daysInMonth) {
                print = ' '; 
            } else {
                print = day - firstDay + 1;
            }
            days.push(<td className="day">{print}</td>); 
        }
        weeks.push(<tr className="week">{days}</tr>);
    }

    return weeks;
}

var MonthCalendar = React.createClass({
    render() {
        var now = new Date(
            this.props.now.getFullYear(),
            this.props.now.getMonth() + this.props.offset,
            this.props.now.getDate()
        );

        var firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
        var daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
        var weeks = generateRows(firstDay, daysInMonth);

        return (
            <div className="month">
                <table className="month-table">
                    <tbody>{weeks}</tbody>
                </table>
            </div>
        );
    }
});

module.exports = MonthCalendar;
