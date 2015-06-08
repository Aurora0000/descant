var resetApp = angular.module('descant.directives.resetpass', ['descant.config']);

resetApp.directive('resetPassword', function($location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/users/password-reset.html',
		controller: function($rootScope, $http, descantConfig) {
			this.reset = function(email) {
				$http.post(descantConfig.backend + "/api/auth/password/reset/", {"email": email}).success(function(data) {
					$location.path("/");
				}).error(function(data) {
					alert("Error!");
				});
			};

		},
		controllerAs: 'resetCtrl'
	};
});