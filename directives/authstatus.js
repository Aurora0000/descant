var authApp = angular.module('descant.directives.authstatus', ['descant.config', 'descant.services.tokenservice']);


authApp.directive('authStatus', ['$http', 'tokenService', 'descantConfig', function($http, tokenService, descantConfig) {
	return {
		restrict: 'E',
		templateUrl: 'templates/users/auth-status.html',
		controller: ['$http', '$scope', 'tokenService', function($http, $scope, tokenService) {
			this.tryAuth = function() {
				var req = $http.get(descantConfig.backend + "/api/auth/me/");
				req.success(function (data) {
					authCtrl.user = data;
					authCtrl.loaded = true;
					authCtrl.error = false;
				});
				req.error(function(data) {
					authCtrl.loaded = true;
					authCtrl.error = true;
				});
			};

			$scope.tokenServ = tokenService;
			var authCtrl = this;
			$scope.$on('auth:statusChange', function(event, data) {
				authCtrl.tryAuth();
			});
			authCtrl.tryAuth();
		}],
		controllerAs: 'auth'
	}
}]);