var React = require('react');

var DateCell = React.createClass({
    render() {
       return (
           <td className="day" style={this.props.absenceDay ? {color:'red'} : null}>{this.props.date}</td>
       );  
    }
});

module.exports = DateCell;
