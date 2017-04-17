var authApp = angular.module('descant.directives.authstatus', ['descant.config', 'descant.services.tokenservice',
															   'descant.services.templateservice']);


authApp.directive('authStatus', function($http, tokenService, descantConfig, templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/users/auth-status.html';	
		},
		controller: function($http, $scope, tokenService) {
			this.tryAuth = function() {
				var ctrl = this;
				tokenService.getAuthStatus().then(function(data) {
					ctrl.user = data.data;
					ctrl.error = false;
				}, function(data) {
					ctrl.error = true;
				});
			};

			$scope.tokenServ = tokenService;
			var authCtrl = this;
			$scope.$on('auth:statusChange', function(event, data) {
				tokenService.loaded = false;
				authCtrl.tryAuth();
			});
			authCtrl.tryAuth();
		},
		controllerAs: 'auth'
	}
});