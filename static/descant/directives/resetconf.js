var resetCApp = angular.module('descant.directives.resetconf', ['descant.config', 'descant.services.templateservice']);

resetCApp.directive('resetPasswordConfirm', function($location, templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/users/password-reset-confirm.html';	
		},
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