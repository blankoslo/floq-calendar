var React = require('react');
var Fluxxor = require('fluxxor');

var DateCell = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
    ],

    handleClick(event) {
        if (this.props.absenceDay) {
            console.log("TODO: handle this case.");
            return;
        }

        this.getFlux().actions.createAbsenceDay(this.props.date);
        console.log("DateCell", this.props.date);
    },

    render() {
       var date = this.props.date;

       return (
           <td
               onClick={this.handleClick}
               className="day"
               style={this.props.absenceDay ? {color:'red'} : null}
           >
               {date ? date.getDate() : null}
           </td>
       );  
    }
});

module.exports = DateCell;
