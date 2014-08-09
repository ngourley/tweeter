'use strict';

angular.module('twerp').controller('ActionsController',
    ['$scope', '$location', 'websocket',
    function($scope, $location, websocket) {

        $scope.topic;

        websocket.on('connect', function () {

        });

        websocket.on('retweet::topic', function (err, data) {
            if (err) {
                return $.notify(err.statusCode + ' ' + err.twitterReply, "warn");
            }
            $.notify('Retweeted: ' + data.retweeted_status.text, "success");
        });

        $scope.retweetTopic = function() {
            websocket.emit('retweet::topic', $scope.topic);
            $scope.topic = '';
        };

        $scope.$on('$destroy', function (event) {
            websocket.removeAllListeners();
        });
}]);