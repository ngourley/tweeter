'use strict';

angular.module('twerp').controller('FollowersController',
    ['$scope', '$location', 'websocket',
    function($scope, $location, websocket) {

        // Query for followers, web service should use cache and requery every 1 minute
        // actually web service should be intelliget!! We can query usage and know that interval is 
        // every 15 minutes, so take the number of requests allowed and update if data is "stale" for this
        // specific request type
        // some logic might be needed to take in to account for pagination

        websocket.on('connect', function () {
            websocket.emit('followers::list');
        });

        websocket.emit('followers::list');

        websocket.on('followers::list', function (err, data) {
            $scope.followers = data;
            // console.log(data);
            // setTimeout(autoLink, 400);
        });

        $scope.getLargerImage = function (url) {
            var newUrl = url.replace('_normal.jpeg', '_200x200.jpeg');
            return newUrl;
        };

        // function autoLink () {
        //     var tweetTexts = $('.tweet-text');
        //     tweetTexts.each(function() {
        //         var originalText = $(this).text();
        //         var linkedText = Autolinker.link(originalText);
        //         $(this).html(linkedText);
        //     });
        // };
}]);