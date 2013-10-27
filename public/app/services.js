
postrApp.factory('Auth', function ($http, $rootScope, $cookieStore) {
	'use strict';
	
	var isLoggedIn = $cookieStore.get('login') || true;

	var changeState = function (state) {
		isLoggedIn = state;
		$cookieStore.put(state);
	};
	return {
		isLoggedIn: function() {
			return isLoggedIn == true;
		},
		login: function(user, success, error) {
			$http.post('/login', user).success(function (data) {
				changeState( true );
				success();
			}).error(error || function () {});
		},
		logout: function(success, error) {
			$http.get('/logout').success(function () {
				changeState( false );
				if (success)
					success();
			}).error(error || function () {});
		}
	};

});