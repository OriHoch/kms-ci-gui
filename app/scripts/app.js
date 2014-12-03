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


angular.module('kmsci', []).factory('kmsci', ['$http', function($http){
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
        run: function(params) {
            $http.post('http://localhost:8066/', {'params': params}).success(function(data){
                console.log(data);
            });
        }
    };
}]);
