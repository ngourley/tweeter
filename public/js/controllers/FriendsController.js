'use strict';

angular.module('twerp').controller('FriendsController',
    ['$scope', '$location', 'websocket',
    function($scope, $location, websocket) {

        websocket.emit('friends::list');

        websocket.on('friends::list', function (err, data) {
            $scope.friends = data;
        });

        $scope.getLargerImage = function (url) {
            var newUrl = url.replace('_normal.jpeg', '_200x200.jpeg');
            return newUrl;
        };

        $scope.$on('$destroy', function (event) {
            websocket.removeAllListeners();
        });
}]);