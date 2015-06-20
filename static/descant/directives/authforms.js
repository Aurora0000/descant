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
			this.error = false;
			
			this.register = function(user, email, pass) {
				var req = $http.post(descantConfig.backend + "/api/auth/register/", {"email": email, "username": user, "password": pass});
				var ctrl = this;
				req.success(function(data) {
					$location.path('/registered');
				});
				req.error(function(data, status) {
					ctrl.error = true;
					if (data['username'] != null) {
						if (data['username'].indexOf('This field must be unique.') != -1) {
							ctrl.errorMessage = 'ERROR_USERNAME_TAKEN';
						}
						else if (data['username'].indexOf('This field may not be blank.') != -1) {
							ctrl.errorMessage = 'ERROR_USERNAME_BLANK';
						}
						else if (data['username'].indexOf('Enter a valid username. This value may contain only letters, numbers and @/./+/-/_ characters.') != -1) {
							ctrl.errorMessage = 'ERROR_INVALID_USERNAME';
						}
						else if (data['username'].indexOf('Ensure this field has no more than 30 characters.') != -1) {
							ctrl.errorMessage = 'ERROR_INVALID_USERNAME';
						}
						else if (data['username'].indexOf('This field is required.') != -1) {
							ctrl.errorMessage = 'ERROR_USERNAME_BLANK';
						}
					}
					else if (data['email'] != null) {
						if (data['email'].indexOf('This field may not be blank.') != -1) {
							// Never called, the backend currently doesn't care if a username isn't sent.
							ctrl.errorMessage = 'ERROR_EMAIL_BLANK';
						}
					}
					else if (data['password'] != null) {
						if (data['password'].indexOf('This field may not be blank.') != -1) {
							ctrl.errorMessage = 'ERROR_PASSWORD_BLANK';
						}
						else if (data['password'].indexOf('Ensure this field has no more than 128 characters.') != -1) {
							ctrl.errorMessage = 'ERROR_LONG_PASSWORD';
						}
					}
					else if (status == 429) {
						ctrl.errorMessage = 'ERROR_THROTTLED';
					}
					else if (status == 500) {
						ctrl.errorMessage = 'ERROR_SERVER_ERROR';
					}
					else {	
						ctrl.errorMessage = 'Unexpected error. Please report this to the developers: ' + data;
					}
				});
			};
		},
		controllerAs: 'registerCtrl'
	};
});