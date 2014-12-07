'use strict';

/**
 * @ngdoc overview
 * @name kmsCiGuiApp
 * @description
 * # kmsCiGuiApp
 *
 * Main module of the application.
 */
angular
  .module('kmsCiGuiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'kmsci'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


angular.module('kmsci', []).factory('kmsci', ['$http', '$timeout', '$q', function($http, $timeout, $q){
    var run = function(params, statusCallback) {
        return $q(function(resolve, reject) {
            $http.jsonp('http://localhost:8066/?callback=JSON_CALLBACK', {
                'params': {'cmd': 'run', 'params': params},
                'cache': false
            }).success(function(data){
                if (data.ok) {
                    statusCallback(data);
                    run_timeout(statusCallback).then(function(data) {
                        resolve(data);
                    }, function(errmsg) {
                        reject(errmsg);
                    });
                } else {
                    reject('error: ' + data.msg);
                }
            }).error(function(){
                reject('unexpected error');
            });
        });
    };
    var run_timeout = function(statusCallback) {
        return $q(function(resolve, reject) {
            $http.jsonp('http://localhost:8066/?callback=JSON_CALLBACK', {
                'params': {'cmd': 'run_status'},
                'cache': false
            }).success(function(data){
                if (data.ok) {
                    statusCallback(data);
                    if (!data.done) {
                        $timeout(function(){
                            run_timeout(statusCallback).then(resolve, reject);
                        }, 150);
                    } else {
                        resolve(data);
                    }
                } else {
                    reject('ERROR: ' + data.msg);
                }
            }).error(function(){
                reject('UNEXPECTED ERROR!');
            });
        });
    };

    return {
        help: function(callback) {
            callback({
                'tasks': {
                    'all': {
                        title: 'All tests',
                        summary: 'run all integrations and unit tests',
                        value: true
                    },
                    'tests': {
                        title: 'Unit tests',
                        summary: 'run the unit tests',
                        value: false
                    },
                    'qunit': {
                        title: 'Qunit tests',
                        summary: 'run the qunit tests',
                        value: false
                    },
                    'integrations': {
                        title: 'Integration tests',
                        summary: 'run the integration tests',
                        value: false
                    }
                },
                'opts': {
                    'filter': {
                        title: 'filter',
                        summary: 'regular expression filter of tests (unit-tests on class name, integrations on integration id)',
                        value: ''
                    },
                    'filter-tests': {
                        title: 'filter tests',
                        summary: 'regular expression filter of individual test methods',
                        value: ''
                    }
                }
            });
        },
        run: function(params, statusCallback) {
            return run(params, statusCallback);
        }
    };
}]);
