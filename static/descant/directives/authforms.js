var authFormApp = angular.module('descant.directives.authforms', ['descant.config', 'descant.services.tokenservice']);

authFormApp.directive('loginBox', ['tokenService', '$location', function(tokenService, $location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/users/login-box.html',
		controller: function() {
			this.login = function(user, pass) {
				tokenService.login(user, pass).then(function(data){
					$location.path('/');
				}, function(data) {
					alert("Invalid user/password!");
				});
			};
		},
		controllerAs: 'loginCtrl'
	};
}]);

authFormApp.directive('registerBox', function($location) {
	return {
		restrict: 'E',
		templateUrl: 'templates/users/register-box.html',
		controller: function($http, descantConfig) {
			this.enforce = descantConfig.enforcePasswordEntropy;
			
			this.register = function(user, email, pass) {
				var req = $http.post(descantConfig.backend + "/api/auth/register/", {"email": email, "username": user, "password": pass});
				req.success(function(data) {
					$location.path('/registered');
				});
				req.error(function(data) {
					alert("There was an error while trying to register.");
				});
			};
		},
		controllerAs: 'registerCtrl'
	};
});