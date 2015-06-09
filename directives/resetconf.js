var resetCApp = angular.module('descant.directives.resetconf', ['descant.config']);

resetCApp.directive('resetPasswordConfirm', function($location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/users/password-reset-confirm.html',
		controller: function($rootScope, $http, descantConfig) {
			this.reset = function(uid, token, new_pass) {
				$http.post(descantConfig.backend + "/api/auth/password/reset/confirm/", {"uid": uid, "token": token, "new_password": new_pass}).success(function(data) {
					$location.path("/");
				}).error(function(data) {
					alert("Error!");
				});
			};

		},
		controllerAs: 'resetCtrl'
	};
});