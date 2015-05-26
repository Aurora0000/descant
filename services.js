app = angular.module('descant.services', ['descant.config', 'LocalStorageModule']);

app.service('tokenService', function($http, descantConfig, localStorageService) {
	this.authenticated = false;
	this.token = '';
	this.login = function(user, pass) {
		this.authenticated = false;
		this.token = "";
		var req = $http.post(descantConfig.backend + '/api/auth/login/', {'username': user, 'password': pass});
		req.success(function(data) {
			this.token = data['auth_token'];
			this.authenticated = true;
  		localStorageService.set('authToken', this.token);
		});
		req.error(function(data){
			this.token = "";
			this.authenticated = false;
		});
	};
	this.logout = function() {
    $http.defaults.headers.common.Authorization = 'Token ' + this.token;
		var req = $http.post(descantConfig.backend + "/api/auth/logout/", {});
		req.success(function(data) {
			this.authenticated = false;
			this.token = "";
		});
		req.error(function(data) {
			this.authenticated = true;
		});
	};
	this.getToken = function() {
		if (this.authenticated) {
				return this.token;
		}
		tokenVal = localStorageService.get('authToken');
		if (tokenVal != null) {
			this.authenticated = true;
			this.token = tokenVal;
			return this.token;
		}
		else {
			return false;
		}
	};
});
