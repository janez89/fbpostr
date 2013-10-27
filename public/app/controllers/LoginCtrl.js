
postrApp.controller('LoginCtrl', function LoginCtrl ($scope, Auth, $location) {
	$scope.loginError = false;

	$scope.doLogin = function () {
		Auth.login($scope.user, function () {
			$location.path('/');
		}, function () {
			$scope.loginError = true;
		});
	};
});