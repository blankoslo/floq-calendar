var React = require('react');
var Fluxxor = require('fluxxor');

var AppWrapper = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React)
    ],

    render() {
        return (
            <div className='main-content'>
                {this.props.children}
            </div>
        );
    }
});

module.exports = AppWrapper;
