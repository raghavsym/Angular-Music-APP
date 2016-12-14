var app = angular.module('LetsChangeApp');
app.factory('movieService', function($http, $log, $q) {
  return {
   getMovie: function() {
     var deferred = $q.defer();
     $http.get('http://playlist-royletzchange.rhcloud.com/list')
       .success(function(data) { 
          deferred.resolve(data);
       }).error(function(msg, code) {
          deferred.reject(msg);
          $log.error(msg, code);
       });
     return deferred.promise;
   }
  }
});