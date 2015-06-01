var tokenApp = angular.module('descant.services.tokenservice', ['descant.config', 'LocalStorageModule']);

tokenApp.service('tokenService', function($http, $q, $rootScope, descantConfig, localStorageService) {
	this.authenticated = false;
	this.token = '';
	this.login = function(user, pass) {
		this.authenticated = false;
		this.token = "";
		var serv = this;
		var req = $http.post(descantConfig.backend + '/api/auth/login/', {'username': user, 'password': pass});
		req.then(function(data) {
			serv.token = data.data['auth_token'];
			serv.authenticated = true;
  		localStorageService.set('authToken', serv.token);
			serv.setHeader();
			$rootScope.$broadcast('auth:statusChange');
			return data;
		},
		function(data){
			serv.token = "";
			serv.authenticated = false;
  		localStorageService.remove('authToken');
			return $q.reject(data);
		});
		return req;
	};
	this.logout = function() {
		var req = $http.post(descantConfig.backend + "/api/auth/logout/", {});
		var serv = this;
		req.then(function(data) {
			serv.authenticated = false;
			serv.token = "";
  		localStorageService.remove('authToken');
			serv.setHeader();
			$rootScope.$broadcast('auth:statusChange');
			return data;
		},
		function(data) {
			serv.authenticated = true;
			return $q.reject(data);
		});
		return req;
	};
	this.getToken = function() {
		if (this.authenticated) {
				return this.token;
		}
		var tokenVal = localStorageService.get('authToken');
		if (tokenVal != null) {
			this.authenticated = true;
			this.token = tokenVal;
			return this.token;
		}
		else {
			return false;
		}
	};
	this.setHeader = function() {
		var tok = this.getToken();
		if (tok != false) {
			$http.defaults.headers.common.Authorization = 'Token ' + tok;
		}
		else {
			$http.defaults.headers.common.Authorization = null;
		}
	};
	this.purgeToken = function () {
		localStorageService.remove('authToken');
	};
	this.getAuthStatus = function() {
		if (this.loaded && !this.error) {
			return $q(function(resolve, reject) {
				resolve(this.user);
			});
		}
		var req = $http.get(descantConfig.backend + "/api/auth/me/");
		var ctrl = this;
		req.then(function (data) {
			ctrl.user = data;
			ctrl.loaded = true;
			ctrl.error = false;
			return data;
		},
		function(data) {
			ctrl.loaded = true;
			ctrl.error = true;
			return $q.reject(data);
		});
		return req;
	};
});
