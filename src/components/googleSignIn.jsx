const React = require('react');
const Fluxxor = require('fluxxor');

const GoogleSignIn = React.createClass({
  mixins: [
    Fluxxor.FluxMixin(React)
  ],

  componentDidMount() {
    window.addEventListener('googleloaded', this.renderGoogleLoginButton);
  },

  onSignIn(googleUser) {
    const token = googleUser.getAuthResponse().id_token;

    this.getFlux().actions.googleSigninSucceeded(token);
    this.getFlux().actions.getLoggedInEmployee();
  },

  onFailure() {
    console.log("An error occured with logging in!");
  },

  renderGoogleLoginButton() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile',
      width: 250,
      height: 50,
      longtitle: true,
      theme: 'light',
      onsuccess: this.onSignIn,
      onfailure: this.onFailure
    });
  },


  render() {
    return <div id='my-signin2' />;
  }

});

module.exports = GoogleSignIn;
