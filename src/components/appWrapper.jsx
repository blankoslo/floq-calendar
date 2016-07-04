var React = require('react');
var Fluxxor = require('fluxxor');

var AppWrapper = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React)
    ],

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
});

module.exports = AppWrapper;
