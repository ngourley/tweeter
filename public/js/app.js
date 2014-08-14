'use strict';

// Init App
angular.module('twerp', [
    'ngRoute',
    'twerp.filters',
    'twerp.services',
    'twerp.directives',
    'twerp.controllers',
    'btford.socket-io',
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl:'partials/home',
        controller: 'HomeController',
    });
    $routeProvider.when('/followers', {
        templateUrl:'partials/followers',
        controller: 'FollowersController',
    });
    $routeProvider.when('/friends', {
        templateUrl:'partials/friends',
        controller: 'FriendsController',
    });
    $routeProvider.when('/actions', {
        templateUrl:'partials/actions',
        controller: 'ActionsController',
    });
    $routeProvider.when('/automation', {
        templateUrl:'partials/automation',
        controller: 'AutomationController'
    });
    $routeProvider.otherwise({redirectTo: '/home'});
}]).run(function($rootScope) {
    $(document).foundation();
});

// Init Controllers
angular.module('twerp.controllers', []);

// Init Services
angular.module('twerp.services', []);

// Init Filters
angular.module('twerp.filters', []);

// Init Directives
angular.module('twerp.directives', []);

// Service for Socketio
angular.module('twerp').factory('websocket', function (socketFactory) {
    return socketFactory();
});