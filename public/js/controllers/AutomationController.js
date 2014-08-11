'use strict';

angular.module('twerp').controller('AutomationController',
    ['$scope', '$location', 'websocket',
    function($scope, $location, websocket) {

        websocket.emit('tasks::list');

        websocket.on('tasks::list', function (err, data) {

            _.each(data, function (task) {
                task.interval = moment.duration(task.interval)
                task.form = {};
                task.form.unit = 'minutes';
                task.form.amount = task.interval.asMinutes();
            });

            $scope.tasks = data;
        });

        $scope.$watch('tasks', function (newVal, oldVal) {

            if (oldVal === undefined) {
                return;
            }

            _.each(newVal, function (task, idx) {

                if (task.form.amount === undefined) {
                    return;
                }

                task.interval =
                    moment.duration(task.form.amount, task.form.unit);
            });

        }, true);

        $scope.$on('$destroy', function (event) {
            websocket.removeAllListeners();
        });
}]);