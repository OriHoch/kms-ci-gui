'use strict';

/**
 * @ngdoc function
 * @name kmsCiGuiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the kmsCiGuiApp
 */
angular.module('kmsCiGuiApp')
  .controller('MainCtrl', ['$scope', '$http', 'kmsci', function ($scope, $http, kmsci) {
        $scope.init = function() {
            $('[data-toggle="tooltip"]').tooltip({
                animation: false,
                delay: 0
            });
        };

        $scope.run = function() {
            var params = [];
            angular.forEach($scope.tasks, function(task, param) {
                if (task.value) {
                    params.push('--'+param);
                }
            });
            angular.forEach($scope.opts, function(opt, param) {
                if (opt.value != '') {
                    params.push('--'+param+' '+opt.value);
                }
            });
            kmsci.run(params.join(' '));
        };

        kmsci.help(function(data) {
            $scope.tasks = data.tasks;
            $scope.opts = data.opts;
        });
  }]);
