'use strict';

angular.module('twerp').controller('AutomationController',
    ['$scope', '$location', 'websocket',
    function($scope, $location, websocket) {

        $scope.derp = function (task) {
            moment.duration(task.time_count, task.time_metric);
            return moment.duration(task.time_count, task.time_metric);
        }

        websocket.emit('tasks::list');

        websocket.on('tasks::list', function (err, data) {
            $scope.tasks = data;
        });

        $scope.$on('$destroy', function (event) {
            websocket.removeAllListeners();
        });
}]);