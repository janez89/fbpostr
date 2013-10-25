
postrApp.controller('SettingsCtrl', function SettingsCtrl ($scope, $http, $resource, ngTableParams) {

    $scope.loggedIn = false;
    $scope.loginUrl = '';

    $scope.doCheck = function () {
        $http.get('/account/check').then(function (resp) {
            $scope.loggedIn = resp.data.login;
            $scope.loginUrl = resp.data.loginUrl;
        });
    };

    $scope.doRemove = function (account) {
        if (!confirm('Biztosan eltávolítod a "'+ account.name +'" felhasználót?'))
            return false;
        $http({method: 'DELETE', url: '/account/'+ account.id }).then(function (resp) {
            $scope.doReloadAccountData();
            $scope.doReloadFanpageData();
        });
    };

    $scope.doCheck(); // check login

	
    $scope.loading = true;
	var Account = $resource('/account/:id', {'id': '@id'});

    $scope.accountParams = new ngTableParams({
        page: 1, // show first page
        total: 0, // length of data
        count: 10, // count per page
        counts: [10]
    });

    var getAccountData = function () {
        $scope.loading = true;
        // ajax request to api
        Account.get($scope.accountParams.url(), function (data) {
            $scope.accounts = data.docs;
            $scope.accountParams.total = data.count;
            $scope.loading = false;
        });
    };

    $scope.doReloadAccountData = getAccountData;
    // watch updates
    $scope.$watch('accountParams', getAccountData, false);

    // fanpages --------------------------------------------
    var Fanpage = $resource('/fanpage/:id', {'id': '@id'});

    $scope.fanpageParams = new ngTableParams({
        page: 1, // show first page
        total: 0, // length of data
        count: 10, // count per page
        counts: [10]
    });

    var getFanpageData = function () {
        $scope.loading = true;
        // ajax request to api
        Fanpage.get($scope.fanpageParams.url(), function (data) {
            $scope.fanpages = data.docs;
            $scope.fanpageParams.total = data.count;
            $scope.loading = false;
        });
    };

    $scope.doReloadFanpageData = getFanpageData;
    // watch updates
    $scope.$watch('fanpageParams', getFanpageData, false);
    

    $scope.updatedFanpages = false;
    $scope.doUpdateFanpage = function (account) {
        $http.get('/account/'+ account.id +'/loadpages').then(function (resp) {
            getFanpageData();
            $scope.updatedFanpages = true;
        });
    };

    $scope.doRemovePage = function (page) {
        if (!confirm('Biztosan eltávolítod a "'+ page.name +'" oldalt?'))
            return false;
        $http({ method: 'DELETE', url: '/fanpage/'+ page.id}).then(function (resp) {
            getFanpageData();
        });
    };
});