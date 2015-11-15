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

app.controller('ListController', ['GoogleDriveService', function(GoogleDriveService){
    var lc = this;

}]);

app.controller('DocController', ['GoogleDriveService', function(GoogleDriveServices){
    var dc = this;

}]);

/******************************
    GOOGLE DOC SERVICE STACK
*******************************/

app.service('GoogleDriveService', ['$http', 'ConfigService', function($http, ConfigService){
    var svc = this;

    /**
   * Handle response from authorization server.
   *
   * @param {Object} authResult Authorization result.
   */
  svc.handleAuthResult = function(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
      // Hide auth UI, then load client library.
      authorizeDiv.style.display = 'none';
      loadDriveApi();
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
  svc.handleAuthClick = function(event) {
    gapi.auth.authorize(
      {client_id: ConfigService.CLIENT_ID, scope: ConfigService.SCOPES, immediate: false},
      handleAuthResult);
    return false;
};

  /**
   * Load Drive API client library.
   */
  svc.loadDriveApi = function() {
    gapi.client.load('drive', 'v2', action);
};

  /**
   * Print files.
   */
  svc.listFiles = function() {
    var request = gapi.client.drive.files.list({
        'maxResults': 10,
        'q': "mimeType = 'application/vnd.google-apps.document'"
      });

      request.execute(function(resp) {
        var files = resp.items;
        if (files && files.length > 0) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            appendLink(file.id, file.title);
          }
        } else {
          appendLink('', 'No files found.');
        }
      });
  };

  svc.displayFile = function() {
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
  svc.appendLink = function(id, text){
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
