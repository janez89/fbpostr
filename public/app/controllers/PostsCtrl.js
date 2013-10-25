
postrApp.controller('PostsCtrl', function PostsCtrl ($scope, $resource, $http, ngTableParams) {
	$scope.loading = true;
	var Post = $resource('/post/:id', {'id': '@id'});

    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        total: 0, // length of data
        count: 10, // count per page
        counts: [5, 10, 20, 50],
        sorting: {
            created: 'desc'
        }
    });

    var getData = function () {
        $scope.loading = true;
        // ajax request to api
        /*Log.get($scope.tableParams.url(), function (data) {
            $scope.logs = data.docs;
            $scope.tableParams.total = data.count;
            $scope.loading = false;
        });*/
        $http.get('/post').then(function (resp) {
            $scope.posts = resp.data.docs;
            $scope.tableParams.total = resp.data.count;
        });
    };

    $scope.doReloadData = getData;
    // watch updates
    $scope.$watch('tableParams', getData, false);
});