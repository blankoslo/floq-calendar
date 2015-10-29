var React = require('react');
var Fluxxor = require('fluxxor');

var GoogleSignIn = require('./googleSignIn.jsx');

var AppWrapper = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
    ],

    render() {
        return (
            <div>
                <div id='header'>
                    <header>
                        <h1>Blank Fraværskalender</h1>
                        <GoogleSignIn/>
                    </header>
                </div>
                {this.props.children}
            </div>
        );
    }
});

module.exports = AppWrapper;
