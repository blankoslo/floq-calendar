var React = require('react');
var Fluxxor = require('fluxxor');

var constants = require('./../constants.js');

var DateCell = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
    ],

    handleClick(event) {
        var selected = this.getFlux().store('AbsenceTypeStore').selected;
        let absenceDay = this.props.absenceDay;

        if (!absenceDay) {
            this.getFlux().actions.createAbsenceDay(selected, this.props.date);
            return;
        }

        /*if (!absenceDay.type == selected) {
            this.getFlux().actions.updateAbsenceDay(selected, this.props.absenceDay);
            return;
        }*/

        this.getFlux().actions.deleteAbsenceDay(absenceDay);

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
