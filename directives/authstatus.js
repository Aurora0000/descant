var authApp = angular.module('descant.directives.authstatus', ['descant.config', 'descant.services.tokenservice']);


authApp.directive('authStatus', ['$http', 'tokenService', 'descantConfig', function($http, tokenService, descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/users/auth-status.html',
		controller: ['$http', '$scope', 'tokenService', function($http, $scope, tokenService) {
			this.tryAuth = function() {
				var ctrl = this;
				tokenService.getAuthStatus().then(function(data) {
					ctrl.loaded = true;
					ctrl.error = false;
					ctrl.user = data.data;
				}, function(data) {
					ctrl.loaded = true;
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
		}],
		controllerAs: 'auth'
	}
}]);