'use strict';

angular.module('twerp').controller('HomeController',
    ['$scope', '$location', 'websocket',
    function($scope, $location, websocket) {

        websocket.on('connect', function () {

        });

        websocket.emit('myTweets::list');

        websocket.on('myTweets::list', function (err, data) {
            $scope.tweets = data;
            setTimeout(autoLink, 400);
        });

        function autoLink () {
            var tweetTexts = $('.tweet-text');
            tweetTexts.each(function() {
                var originalText = $(this).text();
                var linkedText = Autolinker.link(originalText);
                $(this).html(linkedText);
            });
        };
}]);