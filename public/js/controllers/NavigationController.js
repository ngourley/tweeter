'use strict';

angular.module('twerp').controller('NavigationController',
    ['$scope', '$location', '$rootScope',
    function($scope, $location, $rootScope) {

        $scope.currentPath = false;

        $rootScope.$on("$locationChangeStart", function(event, next, current) {
            event; next; current;
            var location = $location.path().split('/');
            if (location.length === 1) {
                return;
            }

            $scope.currentPath = location[1];

        });

        $scope.isActive = function(path) {
            if(path === $scope.currentPath) {
                return 'active';
            }
        };

        $scope.navLink = function(newPath) {
            var location = $location.path().split('/');

            if (location.length < 2) {
                return;
            }

            var url = ['', newPath].join('/');
            $location.path(url);
        };

        $scope.$on('$destroy', function (event) {
            websocket.removeAllListeners();
        });
}]);