angular.module('DRRrrRrvrr')
  .service('ConfigService', ['$http', function( $http ){

      var svc = this;
      svc.CLIENT_ID = '';
      svc.SCOPES = '';

      svc.get = function( callback ) {
          $http.get('/js/config.js', {}).then(function(response){
              names.list = response.data;
              console.log(response);
              console.log(response.data);
              if(callback){
                  callback();
              }
            }, function(response){
                console.log(response);
            });
      };

  }]);
