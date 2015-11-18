var React = require('react');
var Fluxxor = require('fluxxor');

var GoogleSignIn = require('./googleSignIn.jsx');

var AppWrapper = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
    ],

    componentWillMount() {
        this.getFlux().actions.getLoggedInEmployee();
    },

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
});

module.exports = AppWrapper;
