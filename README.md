# Philip Regan
philipregan@fas.harvard.edu
CSCI E-32

# About

DRRrrRrvrr is a Google Docs Zombie translator

# Installation

In /src/js, enter your Google Docs Client ID and Scope into the ConfigService code:

app.service('ConfigService', [function(){
    var svc = this;
    svc.CLIENT_ID = '__CLIENT_ID__'; // <== Replace __CLIENT_ID__ with your ID
    svc.SCOPES = ['__SCOPE__']; // <== Replace __SCOPE__ with your Scope
}]);

`$ npm install`
`$ bower install`
`$ gulp`
 Then, in your favorite browser go to `http://localhost:8080/`

For Karma, use
`$ karma start`
