var userStatsApp = angular.module('descant.directives.userstats', ['descant.config']);


userListApp.directive('userStats', function(descantConfig) {
	return {
		restrict: 'E',
		scope: {
			userId: '@'
		},
		templateUrl: 'templates/users/user-stats.html',
		controller: function($http, $scope) {
			var userCtrl = this;
			var req = $http.get(descantConfig.backend + "/api/v0.1/users/" + $scope.userId + "/");
			req.success(function (data) {
				userCtrl.user = data;
				userCtrl.loaded = true;
			});
			req.error(function(data){
				userCtrl.loaded = true;
				userCtrl.error = true;
			});
		},
		controllerAs: 'userCtrl'
	}
});