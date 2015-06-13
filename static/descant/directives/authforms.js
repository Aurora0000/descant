var authFormApp = angular.module('descant.directives.authforms', ['descant.config', 'descant.services.tokenservice', 'descant.services.templateservice']);

authFormApp.directive('loginBox', function(tokenService, templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/users/login-box.html';	
		},
		controller: function($location) {
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
});

authFormApp.directive('registerBox', function(templateService) {
	return {
		restrict: 'E',
		templateUrl: function() {
			return 'templates/' + templateService.currentTemplateSet() + '/users/register-box.html';
		},
		controller: function($http, $location, descantConfig) {
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