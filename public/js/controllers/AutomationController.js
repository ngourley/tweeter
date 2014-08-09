'use strict';

angular.module('twerp').controller('AutomationController',
    ['$scope', '$location', 'websocket',
    function($scope, $location, websocket) {

        $scope.$on('$destroy', function (event) {
            websocket.removeAllListeners();
        });
}]);