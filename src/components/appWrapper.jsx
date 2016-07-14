const React = require('react');
const Fluxxor = require('fluxxor');

const AppWrapper = React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },

  mixins: [
    Fluxxor.FluxMixin(React)
  ],

  render() {
    return (
      <div>
        {this.props.children}
      </div>);
  }
});

module.exports = AppWrapper;
