'use strict';

angular.module('twerp').controller('ActionsController',
    ['$scope', '$location', 'websocket',
    function($scope, $location, websocket) {

        websocket.on('connect', function () {

        });

        websocket.on('retweet::topic', function (err, data) {
            $scope.retweetTopicResult = (err) ? err : data;
        });

        $scope.retweetTopic = function() {
            websocket.emit('retweet::topic', $scope.topic);
        };

}]);