
postrApp.controller('NewPostCtrl', function NewPostsCtrl ($scope, $resource, $http, $routeParams, $timeout, $filter) {

	var Account = $resource('/account');
	var Fanpage = $resource('/fanpage');

	var accounts = Account.get();
	var fanpages = Fanpage.get();

	$scope.post = {};
	$scope.datas = [];
	$scope.patt_time = /^20[1-2]{1}[0-9]{1}\-[0-9]{1}\-[0-9]{1} [1-2]{1}[0-9]{1}:[1-2]{1}[0-9]{1}$/;

	$scope.msgSuccess = false;
	$scope.msgError = false;

	emptyUid = false;

	$scope.$watch('post.type', function (value) {
		if (!value)
			return;
		if (emptyUid)
			$scope.post.uid = "";
		emptyUid = true;
		if (value === 'user')
			return $scope.datas = accounts.docs;
		$scope.datas = fanpages.docs;
	});

	$timeout(function() {
		// init date
		var date = new Date();
		date.setTime(date.getTime() + 600000);
		$scope.post.timed = $filter('date')(date, 'yyyy-MM-dd HH:mm');
		
		if ($routeParams.type !== 'page' && $routeParams.type !== 'user')
			return;
		emptyUid = false;
		$scope.post.type = $routeParams.type;
		$scope.post.uid  = $routeParams.uid;
	}, 500);

	$scope.doSave = function () {
		$http({
			method: 'POST', 
			url: '/post/'+ $scope.post.type +'/'+ $scope.post.uid, 
			data: { 
				message: $scope.post.message, 
				timed: $scope.post.timed,
				picture: $scope.post.picture,
				link: $scope.post.link
			}
		}).then(function (resp) {
			if (resp.status < 400) {
				$scope.msgSuccess = true;
				$scope.msgError = false;
			} else {
				if (resp.status < 400) {
				$scope.msgSuccess = false;
				$scope.msgError = true;
			}
			}
		});
	};
});