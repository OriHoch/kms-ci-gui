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
            $('#main_run_output').removeClass('hidden');
            $('#main_run_output img').removeClass('hidden');
            $('#main_run_output pre').html('');
            kmsci.run(params.join(' '), function(data){
                $('#main_run_output pre').append(data.stdout);
            }).then(function(data){
                $('#main_run_output img').addClass('hidden');
            }, function(errmsg) {
                alert(errmsg);
            });
        };

        kmsci.help(function(data) {
            $scope.tasks = data.tasks;
            $scope.opts = data.opts;
        });
  }]);
