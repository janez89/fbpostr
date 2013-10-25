/* App Module */

var postrApp = angular.module('postrApp', [
	'ngResource', 'ngCookies', 'ngTable'
]);

postrApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.
	when('/', {
		templateUrl: '/app/views/home.html',
		controller: 'HomeCtrl'
	}).
	when('/posts/:type', {
		templateUrl: '/app/views/posts.html',
		controller: 'PostsCtrl'
	}).
	when('/posts', {
		templateUrl: '/app/views/posts.html',
		controller: 'PostsCtrl'
	}).
	when('/post/:type/:uid', {
		templateUrl: '/app/views/new-post.html',
		controller: 'NewPostCtrl'
	}).
	when('/post/:type', {
		templateUrl: '/app/views/new-post.html',
		controller: 'NewPostCtrl'
	}).
	when('/post', {
		templateUrl: '/app/views/new-post.html',
		controller: 'NewPostCtrl'
	}).
	when('/settings', {
		templateUrl: '/app/views/settings.html',
		controller: 'SettingsCtrl'
	}).
	otherwise({
		redirectTo: '/'
	});
}]);