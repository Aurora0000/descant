var userListApp = angular.module('descant.directives.userlist', ['descant.config']);


userListApp.directive('userList', function(descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/users/user-list.html',
		controller: function($http) {
			var usersCtrl = this;
			var req = $http.get(descantConfig.backend + "/api/v0.1/users/");
			req.success(function (data) {
				usersCtrl.list = data;
				usersCtrl.loaded = true;
			});
			req.error(function(data){
				usersCtrl.loaded = true;
				usersCtrl.error = true;
			});
		},
		controllerAs: 'users'
	}
});