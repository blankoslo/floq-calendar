var React = require('react');
var Fluxxor = require('fluxxor');

var AppWrapper = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
    ],

    render() {
        return (
            <div>
                <header><h1>Fraværskalender</h1></header>
                {this.props.children}
            </div>
        );
    }
});

module.exports = AppWrapper;
