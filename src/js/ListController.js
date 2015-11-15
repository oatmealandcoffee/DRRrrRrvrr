angular.module('DRRrrRrvrr', []).
    .controller('ListController', ['posts', function(posts){
        var lc = this;
        lc.posts = posts;
        posts.get();

        lc.setPost = function(id){
            posts.setCurrent(id);
        };

      }]);
