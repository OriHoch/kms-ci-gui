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


angular.module('kmsci', []).factory('kmsci', ['$http', '$timeout', function($http, $timeout){
    var run = function(params) {
        $('#main_run_output').removeClass('hidden');
        $('#main_run_output img').removeClass('hidden');
        $('#main_run_output pre').html('');
        $http.jsonp('http://localhost:8066/?callback=JSON_CALLBACK', {
            'params': {'cmd': 'run', 'params': params},
            'cache': false
        }).success(function(data){
            if (data.ok) {
                console.log(data.msg);
                run_timeout();
            } else {
                alert('ERROR: ' + data.msg);
            }
        }).error(function(){
            alert('UNEXPECTED ERROR!');
        });
    };
    var run_timeout = function() {
        $http.jsonp('http://localhost:8066/?callback=JSON_CALLBACK', {
            'params': {'cmd': 'run_status'},
            'cache': false
        }).success(function(data){
            if (data.ok) {
                console.log(data.msg);
                $('#main_run_output pre').append(data.stdout);
                if (!data.done) {
                    $timeout(run_timeout, 150);
                } else {
                    console.log('stderr: ', data.stderr);
                    console.log('returnval: ', data.returnval);
                    $('#main_run_output img').addClass('hidden');
                }
            } else {
                alert('ERROR: ' + data.msg);
            }
        }).error(function(){
            alert('UNEXPECTED ERROR!');
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
        run: function(params) {
            run(params);
        }
    };
}]);
