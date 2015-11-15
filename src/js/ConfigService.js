angular.module('DRRrrRrvrr')
  .service('ConfigService', ['$http', function( $http ){

      var svc = this;
      svc.data = {};
      svc.CLIENT_ID = '';
      svc.SCOPES = '';

      svc.get = function( callback ) {
          $http.get('/js/config.js', {}).then(function(response){
              svc.data = response.data;
              svc.CLIENT_ID = svc.data.CLIENT_ID;
              svc.SCOPES = svc.data.SCOPES;
              console.log(response);
              console.log(response.data);
              if(callback){
                  callback();
              }
            }, function(response){
                console.log(response);
            });
      };

      svc.get();

  }]);
