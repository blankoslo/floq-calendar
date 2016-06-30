var React = require('react');
var Fluxxor = require('fluxxor');

var GoogleSignIn = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React)
    ],  

    renderGoogleLoginButton() {
        gapi.signin2.render('my-signin2', {
            'scope': 'profile',
            'width': 250,
            'height': 50, 
            'longtitle': true,
            'theme': 'light',
            'onsuccess': this.onSignIn,
            'onfailure': this.onFailure
        })  
    },  

    componentDidMount() {
        window.addEventListener('googleloaded', this.renderGoogleLoginButton);
    },  

    onSignIn(googleUser) {
        var token = googleUser.getAuthResponse().id_token

        this.getFlux().actions.googleSigninSucceeded(token);
        this.getFlux().actions.getLoggedInEmployee();
    },  

    onFailure() {
        console.log("An error occured with logging in!");
    },  

    render() {
        return(
            <div id="my-signin2"/>
        );  
    }   

});

module.exports = GoogleSignIn;
