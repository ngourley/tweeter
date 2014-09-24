'use strict';

angular.module('twerp').controller('HomeController',
    ['$scope', '$location', 'websocket',
    function ($scope, $location, websocket) {

        websocket.on('connect', function () {

        });

        websocket.emit('myTweets::list');

        websocket.on('myTweets::list', function (err, data) {
            $scope.tweets = data;
            setTimeout(autoLink, 400);
        });

        websocket.on('myTweets::delete', function (err, data) {
            if (!err) {
                websocket.emit('myTweets::list');
            }
        });

        function autoLink () {
            var tweetTexts = $('.tweet-text');
            tweetTexts.each(function() {
                var originalText = $(this).text();
                var linkedText = Autolinker.link(originalText);
                $(this).html(linkedText);
            });
        };

        $scope.delete = function (tweet) {
            websocket.emit('myTweets::delete', tweet);
        };

        $scope.$on('$destroy', function (event) {
            websocket.removeAllListeners();
        });
}]);