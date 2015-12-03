var app = angular.module('DRRrrRrvrr', ['ngRoute']);

/*******************
    ROUTING STACK
********************/

app.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/list.html', {
      templateUrl: '/list.html',
      controller: 'ListController',
      controllerAs: 'lc'
    })
    .when('/doc.html', {
      templateUrl: '/doc.html',
      controller: 'DocController',
      controllerAs: 'dc'
    })
    .otherwise({
      redirectTo: '/list.html'
    });
}]);

/**********************
    CONTROLLER STACK
***********************/

app.controller('ListController', ['$scope', '$rootScope', 'GoogleDriveService', function($scope, $rootScope, GoogleDriveService){
    var lc = this;
    lc.files = [];

    lc.handleAuthClick = function(event) {
        console.log('lc.handleAuthClick');
        GoogleDriveService.checkAuth();
        GoogleDriveService.handleAuthClick(event, function(f){
            console.log('f ' + f);
            lc.files = f;
            lc.listFiles();
            $rootScope.$digest();
        });
    };

    $scope.$watch(
        function ( $scope ) {
            // Return the "result" of the watch expression.
            return lc.files;
        },
        lc.listFiles = function () {
            if (lc.files && lc.files.length > 0) {
                for (var i = 0; i < lc.files.length; i++) {
                    var file = lc.files[i];
                    console.log('lc.file: ' + file.title);
                    //lc.appendLink(file.id, file.title);
                }
            } else {
                lc.appendLink('', 'No files found');
            }
        }
    );

    /**
     * Append a link element to the body containing the given text
     * and a link to the /doc page.
     *
     * @param {string} id Id to be used in the link's href attribute.
     * @param {string} text Text to be placed in a element.
     */
    lc.appendLink = function(id, text){
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

app.controller('DocController', ['GoogleDriveService', function(GoogleDriveServices){
    var dc = this;

}]);

/**********************
    DIRECTIVES STACK
***********************/

app.directive('oathbtn', [function(){

    return {
        scope: {
            post: '=',
            body: '='
        },
        transclude: true,
        templateUrl: 'oauth.html',
        controller: 'ListController',
        controllerAs: 'lc',
    };
}]);

/******************************
    GOOGLE DOC SERVICE STACK
*******************************/

app.service('GoogleDriveService', ['$http', '$q','ConfigService', function($http, $q, ConfigService){
    var gds = this;

    gds.authVerified = false;
    gds.files;

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
  gds.handleAuthClick = function(event, callback) {
      console.log('GoogleDriveService.handleAuthClick');

      function asyncGetList() {
          return $q(function ( resolve, reject ) {
            setTimeout( function() {
                if( gds.checkAuth() ) {
                    resolve( 'GoogleDriveService.asyncGetList.resolved' );
                } else {
                    reject( 'GoogleDriveService.asyncGetList.rejected' );
                }
            }, 2000);
          });
      }

      var promise = asyncGetList();
      promise.then( function() {
          // success
          console.log('GoogleDriveService.asyncGetList.promise.success');
          gapi.auth.authorize(
            {client_id: ConfigService.CLIENT_ID, scope: ConfigService.SCOPES, immediate: false},
            gds.handleAuthResult);
            gds.listFiles(callback);
          return false;

      }, function(reason) {
          // failure
          console.log('GoogleDriveService.asyncGetList.promise.failure');
      });

};

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
  gds.listFiles = function(callback) {
      console.log('GoogleDriveService.listFiles');
      if (!gds.authVerified ) {
          return;
      }
    var request = gapi.client.drive.files.list({
        'maxResults': 10,
        'q': "mimeType = 'application/vnd.google-apps.document'"
      });

      request.execute(function(resp) {
        gds.files = resp.items;
          if (callback) {
            callback(gds.files);
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

}]);

app.service('ConfigService', [function(){
    var svc = this;
    svc.CLIENT_ID = '__CLIENT_ID__';  // <== Replace __CLIENT_ID__ with your ID
    svc.SCOPES = ['__SCOPE__'];  // <== Replace __SCOPE__ with your Scope
}]);
