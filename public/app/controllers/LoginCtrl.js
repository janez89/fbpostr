
postrApp.controller('LoginCtrl', function LoginCtrl ($scope, Auth, $location) {
	$scope.loginError = false;

	if (Auth.isLoggedIn()) {
		Auth.logout();
	}

	$scope.doLogin = function () {
		Auth.login($scope.user, function () {
			$location.path('/');
		}, function () {
			$scope.loginError = true;
		});
	};
});