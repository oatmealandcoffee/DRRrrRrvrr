var app = angular.module('DRRrrRrvrr', ['ngRoute']);

/*******************
    ROUTING STACK
********************/

app.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/list', {
      templateUrl: 'templates/list.html',
      controller: 'ListController',
      controllerAs: 'lc'
    })
    .when('/doc', {
      templateUrl: 'templates/doc.html',
      controller: 'DocController',
      controllerAs: 'dc'
    })
    .otherwise({
      redirectTo: '/list'
    });
}]);

/**********************
    CONTROLLER STACK
***********************/

app.controller('ListController', ['$rootScope', 'GoogleDriveService', function($rootScope, GoogleDriveService){
    var lc = this;

    lc.handleAuthClick = function(event) {
        console.log('lc.handleAuthClick');
        GoogleDriveService.checkAuth();
        GoogleDriveService.handleAuthClick(event);
        GoogleDriveService.listFiles();
    };

    lc.checkAuth = function() {
        console.log('lc.checkAuth');
        GoogleDriveService.checkAuth();
    }

}]);

app.controller('DocController', ['GoogleDriveService', function(GoogleDriveServices){
    var dc = this;

}]);

/**********************
    DIRECTIVES STACK
***********************/

app.directive('oathbtn', ['GoogleDriveService', '$interval', function( GoogleDriveService, $interval ){

    var link = function(scope, element, attrs){
        var promise;
        var verifyAuth = function () {
            console.log("window.interval");
            if( GoogleDriveService.checkAuth ){
                GoogleDriveService.checkAuth();
                if ( GoogleDriveService.authVerified ) {
                    $interval.cancel(promise);
                    GoogleDriveService.listFiles();
                }
            }
        };
        var promise = $interval(verifyAuth, 2000);
    };

    return {
        scope: {
            post: '=',
            body: '='
        },
        link: link,
        transclude: true,
        templateUrl: 'oauth.html',
        controller: 'ListController',
        controllerAs: 'lc'
    };
}]);

/******************************
    GOOGLE DOC SERVICE STACK
*******************************/

app.service('GoogleDriveService', ['$http', 'ConfigService', function($http, ConfigService){
    var gds = this;

    gds.authVerified = false;

    gds.checkAuth = function() {
  	console.log('GoogleDriveService.checkAuth');
    gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
    }, gds.handleAuthResult);
    return true;
    };


    /**
   * Handle response from authorization server.
   *
   * @param {Object} authResult Authorization result.
   */
  gds.handleAuthResult = function(authResult) {
      console.log('GoogleDriveService.handleAuthResult');
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
      // Hide auth UI, then load client library.
      authorizeDiv.style.display = 'none';
      gds.loadDriveApi();
      gds.authVerified = true;
    } else {
      // Show auth UI, allowing the user to initiate authorization by
      // clicking authorize button.
      authorizeDiv.style.display = 'inline';
    }
    };

  /**
   * Initiate auth flow in response to user clicking authorize button.
   *
   * @param {Event} event Button click event.
   */
  gds.handleAuthClick = function(event) {
      console.log('GoogleDriveService.handleAuthClick');
    gapi.auth.authorize(
      {client_id: ConfigService.CLIENT_ID, scope: ConfigService.SCOPES, immediate: false},
      gds.handleAuthResult);
    return false;
}   ;

  /**
   * Load Drive API client library.
   */
  gds.loadDriveApi = function() {
      console.log('GoogleDriveService.loadDriveApi');
    gapi.client.load('drive', 'v2');
    };

  /**
   * Print files.
   */
  gds.listFiles = function() {
      console.log('GoogleDriveService.listFiles');
      if (!gds.authVerified ) {
          return;
      }
    var request = gapi.client.drive.files.list({
        'maxResults': 10,
        'q': "mimeType = 'application/vnd.google-apps.document'"
      });

      request.execute(function(resp) {
          console.log(JSON.stringify(resp) );
        var files = resp.items;
        if (files && files.length > 0) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            console.log(file.title);
            gds.appendLink(file.id, file.title);
          }
        } else {

          gds.appendLink('', 'No files found.');
        }
      });
  };

  gds.displayFile = function() {
      if (!gds.authVerified ) {
          return;
      }
    fileId = window.location.hash.substring(1);
    var request = gapi.client.drive.files.get({fileId: fileId});

    request.execute(function(resp) {
      var accessToken = gapi.auth.getToken().access_token;

      $.ajax({
        url: resp.exportLinks["text/plain"],
        type: "GET",
        beforeSend: function(xhr){
          xhr.setRequestHeader('Authorization', "Bearer "+accessToken);
        },
        success: function( data ) {
          $('#output').html(data.replace(/\n/g, "<br>"));
        }
      });

    });
    };

  /**
   * Append a link element to the body containing the given text
   * and a link to the /doc page.
   *
   * @param {string} id Id to be used in the link's href attribute.
   * @param {string} text Text to be placed in a element.
   */
  gds.appendLink = function(id, text){
    if(id != ''){
      var li = $('<li></li>');
      var link = $('<a></a>');
      link.attr('href', '/doc.html#'+id);
      link.html(text);
      li.append(link);
      $('#output ul').append(li);
    } else {
      $('#output').append(text);
    }
    };



}]);

app.service('ConfigService', [function(){
    var svc = this;
    svc.CLIENT_ID = '454670861658-qr85pr5030lnlep82jeb5ljo3025amfe.apps.googleusercontent.com';
    svc.SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
}]);
