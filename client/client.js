/**
 *
 */
var client = (function(angular, _) {
  var client = angular
    .module('rest.client')
    .config(function() {
    })
    .controller('', function() {
    })
    .service('discover', function($resource) {
      var discover = $resource('/api/{resource}', {
        resource: ''
      }, {
        'discover': {
          method: 'OPTIONS'
        }
      });
    })
    .run(function() {

    });
  return client;
})(angular, underscore);