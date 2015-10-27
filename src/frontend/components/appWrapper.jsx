var React = require('react');
var Fluxxor = require('fluxxor');

var AbsenceTypeSelector = require('./absenceTypeSelector.jsx');

var AppWrapper = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
    ],

    render() {
        return (
            <div>
                <div id='header'>
                    <header><h1>Fraværskalender</h1></header>
                    <AbsenceTypeSelector/>
                </div>
                {this.props.children}
            </div>
        );
    }
});

module.exports = AppWrapper;
