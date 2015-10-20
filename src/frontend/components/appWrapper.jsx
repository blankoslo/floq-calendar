var React = require('react');

var AppWrapper = React.createClass({
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
