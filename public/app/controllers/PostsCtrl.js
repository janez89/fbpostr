
postrApp.controller('PostsCtrl', function PostsCtrl ($scope, $resource, $http, $routeParams, ngTableParams) {
	$scope.loading = true;
    $scope.type = $routeParams.type;

	var Post = $resource('/post/:id', {'id': '@id'});

    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        total: 0, // length of data
        count: 10, // count per page
        counts: []
    });

    var getData = function () {
        $scope.loading = true;
        var qs = '';
        if ($routeParams.type)
            qs = '?status='+ ($routeParams.type === 'waiting' ? 0 : 1 );

        $http.get('/post'+ qs).then(function (resp) {
            $scope.posts = resp.data.docs;
            $scope.tableParams.total = resp.data.count;
            $scope.loading = false;
        });
    };

    $scope.doReloadData = getData;
    // watch updates
    $scope.$watch('tableParams', getData, false);
});