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
	when('/404', {
		templateUrl: '/app/views/404.html',
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
	when('/post/:id', {
		templateUrl: '/app/views/view-post.html',
		controller: 'ViewPostCtrl'
	}).
	when('/newpost/:type/:uid', {
		templateUrl: '/app/views/new-post.html',
		controller: 'NewPostCtrl'
	}).
	when('/newpost/:type', {
		templateUrl: '/app/views/new-post.html',
		controller: 'NewPostCtrl'
	}).
	when('/newpost', {
		templateUrl: '/app/views/new-post.html',
		controller: 'NewPostCtrl'
	}).
	when('/repost/:id', {
		templateUrl: '/app/views/re-post.html',
		controller: 'RePostCtrl'
	}).
	when('/settings', {
		templateUrl: '/app/views/settings.html',
		controller: 'SettingsCtrl'
	}).
	otherwise({
		redirectTo: '/404'
	});
}]);