/* App Module */

var postrApp = angular.module('postrApp', [
	'ngResource', 'ngCookies', 'ngTable'
]);

postrApp.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
	$routeProvider.
	when('/', {
		templateUrl: '/app/views/home.html',
		controller: 'HomeCtrl',
		restrict: true
	}).
	when('/404', {
		templateUrl: '/app/views/404.html',
		controller: 'HomeCtrl',
		restrict: false
	}).
	when('/login', {
		templateUrl: '/app/views/login.html',
		controller: 'LoginCtrl',
		restrict: false
	}).
	when('/posts/:type', {
		templateUrl: '/app/views/posts.html',
		controller: 'PostsCtrl',
		restrict: true
	}).
	when('/posts', {
		templateUrl: '/app/views/posts.html',
		controller: 'PostsCtrl',
		restrict: true
	}).
	when('/post/:id', {
		templateUrl: '/app/views/view-post.html',
		controller: 'ViewPostCtrl',
		restrict: true
	}).
	when('/newpost/:type/:uid', {
		templateUrl: '/app/views/new-post.html',
		controller: 'NewPostCtrl',
		restrict: true
	}).
	when('/newpost/:type', {
		templateUrl: '/app/views/new-post.html',
		controller: 'NewPostCtrl',
		restrict: true
	}).
	when('/newpost', {
		templateUrl: '/app/views/new-post.html',
		controller: 'NewPostCtrl',
		restrict: true
	}).
	when('/repost/:id', {
		templateUrl: '/app/views/re-post.html',
		controller: 'RePostCtrl',
		restrict: true
	}).
	when('/settings', {
		templateUrl: '/app/views/settings.html',
		controller: 'SettingsCtrl',
		restrict: true
	}).
	otherwise({
		redirectTo: '/404'
	});

	// http interceptor for session timeout
	var interceptor = ['$location', '$q', function($location, $q) {
		function success(response) {
			return response;
		}

		function error(response) {
			if (response.status === 401) {
				$location.path('/login');
				return $q.reject(response);
			}
			else {
				return $q.reject(response);
			}
		}

		return function(promise) {
			return promise.then(success, error);
		};
	}];

	$httpProvider.responseInterceptors.push(interceptor);
}]);

postrApp.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (next.restrict && !Auth.isLoggedIn()) {
            $location.path('/login');
        }
    });

}]);