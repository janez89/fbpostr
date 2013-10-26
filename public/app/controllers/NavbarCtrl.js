
postrApp.controller('NavbarCtrl', function NavbarCtrl ($scope, $rootScope, $location) {
	// active link
	$scope.activeLink = $location.path();
	// navbar links
	$scope.links = [
		{ url: '/posts', name: 'Bejegyzések' },
		{ url: '/newpost', name: 'Új bejegyzés' },
		{ url: '/settings', name: 'Facebook hozzáférések' },
		{ url: '/logout', name: 'Kilépés' }
	];

	$rootScope.$on("$routeChangeStart", function (event, next, current) {
		if ($location.path().match(/^\/posts(\/waiting|\/shared)?|\/post\/.*$/i))
			$scope.activeLink = '/posts';
		else if ($location.path().match(/^\/newpost\/.*$/i))
			$scope.activeLink = '/newpost';
		else
			$scope.activeLink = $location.path();
    });
});