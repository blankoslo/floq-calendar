var React = require('react');
var Fluxxor = require('fluxxor');

var constants = require('./../constants.js');

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
    },

    render() {
       var date = this.props.date;

       return (
           <td
               onClick={this.handleClick}
               className="day"
               style={this._generateStyles()}
           >
               {date ? date.getDate() : null}
           </td>
       );  
    },

    _generateStyles() {
        if (!this.props.absenceDay) return {};

        return {
            color: constants.ABSENCE_TYPE_COLORS[this.props.absenceDay.type]
        }
    }
});

module.exports = DateCell;
