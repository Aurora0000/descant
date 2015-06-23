var resetApp = angular.module('descant.directives.resetpass', ['descant.config', 'descant.services.templateservice']);

resetApp.directive('resetPassword', function(templateService) {
	return {
		restrict: 'AE',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/users/password-reset.html';	
		},
		controller: function($rootScope, $http, $location, descantConfig) {
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